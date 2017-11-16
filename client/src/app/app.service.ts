import { Injectable, Injector } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { AppModel } from './app.model';
import { AuthService } from './components/auth/auth.service';
import { ApiService } from './api.service';

@Injectable()
export abstract class AppService<Model extends AppModel> {
  protected _authService: AuthService;
  private api: ApiService;
  constructor(
    private injector: Injector
  ) {
   // this._authService = Inject(AuthService);
    this._authService = this.injector.get(AuthService);
    this.api = this.injector.get(ApiService);
    console.log("this.authService: ", this._authService);
    console.log("this.authService.token: ", this._authService.token);
    this.dataStore = { items: [] };
    this._items = <BehaviorSubject<Model[]>>new BehaviorSubject([]);

  }

  private dataStore: {
    items: Model[]
  };

  private _items: BehaviorSubject<Model[]>;

  protected abstract getResource(): string;

  public removeItemFromStore(id: string) {
    this.dataStore.items = this.dataStore.items.filter(
      item => item._id !== id
    );
  } 

  public removeLastItemFromStore() {
    this.dataStore.items.pop();
  }

  /*
    factory function to instantiate
    object of class extending AppModel
   */
  protected abstract new(data?: any): Model;

  // GET all items from requested resource
  getAll(options?: any): Observable<Model[]> {
    return this.api.get(
      'api/' + this.getResource(),
      options
    ).switchMap((res: Model[]) => {
      let body = res;
      console.log("BODY: ", body);
      let temp: Model[] = [];
      body.forEach((item: Model) => { temp.push(this.new(item))});
      // set all the items
      // retrieved from the backend
      // as our cached set
      this.dataStore.items = temp;

      console.log("TEMP: ", temp);

      // set the next item to emit in the BehaviorSubject
      this._items.next(Object.assign(
        {},
        this.dataStore
      ).items);
      return this._items.asObservable();
    }).catch(this.api.handleError);
  }

  // GET resource specified by id
  get(id: string, options?: any): Observable<Model> {
    const url = `api/${this.getResource()}/${id || ''}`;
    return this.api.get(
      url
    ).switchMap((res: Model) => {
      let body = res;
      let idx;
      let temp: Model = this.new(body);
      this.dataStore.items.forEach((item, index) => {
        if (item._id === temp._id) {
          this.dataStore.items[index] = temp;
          idx = index;
        }
      });
      if (!idx) {
        this.dataStore.items.push(temp);
        idx = this.dataStore.items.length - 1;
      }
      this._items.next(Object.assign(
        {},
        this.dataStore
      ).items);
      return Observable.of(this._items.value[idx]);
    })
    .catch(this.api.handleError.bind(ApiService));
  }

  // DELETE resource specified by id
  delete(id: string): Observable<Model> {
    const headers = [
      { key: 'Authorization', value: this._authService.token }
    ];
    const options = { headers }
    const url = `api/${this.getResource()}/${id}`;
    this.requestInFlight = true;
    return this.api.delete(
      url, 
      options
    ).map((res: HttpResponse<any>) => {
      // on successful backend deletion,
      // remove the item from our cache
      this.removeItemFromStore(id);
      // set the next item to emit in the BehaviorSubject
      this._items.next(
        Object.assign(
          {},
          this.dataStore
        ).items);
      this.requestInFlight = false;          
    }).catch(this.api.handleError);
  }

  // PUT updated resource specified by id
  update(body: AppModel): Observable<Model> {
    const headers = [
      { key: 'Authorization', value: this._authService.token }
    ];
    const options = { headers };
    const url = `api/${this.getResource()}/${body._id}`;
    return this.api.put(
      url, 
      body,
      options
    ).map((res: Object) => {
      let body = res['data'];
      this.editedItem = this.new(body);
      this.dataStore.items.forEach((item, index) => {
        if (item._id === this.editedItem._id) {
          this.dataStore.items[index] = this.editedItem;
        }
      });
      this._items.next(
        Object.assign(
          {},
          this.dataStore
        ).items);
      return this.editedItem;
    }).catch(this.api.handleError);
  }

  protected updateDataStore(body: AppModel) {
    this.editedItem = this.new(body);
    this.dataStore.items.forEach((item, index) => {
      if (item._id === this.editedItem._id) {
        this.dataStore.items[index] = this.editedItem;
      }
    });
    this._items.next(
      Object.assign(
        {},
        this.dataStore
      ).items);
  }

  // POST newly created item
  create(body: AppModel): Observable<Model[]> {
    const headers = [
      { key: 'Authorization', value: this._authService.token }
    ];
    const options = { headers };
    const url = `api/${this.getResource()}`;
    return this.api.post(
      url, 
      body, 
      options
    ).switchMap((res: Object) => {
      let body = res['data'];
      this.newlyCreatedItem = this.new(body);
      // insert our newly created item into the cache
      //this.dataStore.items.pop();
      this.dataStore.items.unshift(this.newlyCreatedItem);

      this._items.next(
        Object.assign(
          {},
          this.dataStore
        ).items);
      return this._items.asObservable();
    }).catch(this.api.handleError);
  }

  get uploadRequestInFlight() {
    return this._uploadRequestInFlight;
  }

  set uploadRequestInFlight(val: boolean) {
    this._uploadRequestInFlight = val;
  }

  set requestInFlight(val: boolean) {
    this._requestInFlight = val;
  }

  get requestInFlight() {
    return this._requestInFlight;
  }

  protected _uploadRequestInFlight: boolean;
  protected _requestInFlight: boolean;

  public newlyCreatedItem: Model;
  public editedItem: Model;
}
