import { Injectable, Injector } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions, Headers } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs/rx';

import { AppModel } from './app.model';
import { AuthService } from './auth/auth.service';

@Injectable()
export abstract class AppService<Model extends AppModel> {
  protected _authService: AuthService;
  constructor(
    protected http: Http,
    private injector: Injector
  ) {
   // this._authService = Inject(AuthService);
    this._authService = this.injector.get(AuthService);
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

  /*
    factory function to instantiate
    object of class extending AppModel
   */
  protected abstract new(data?: any): Model;

  // GET all items from requested resource
  getAll(options?: any): Observable<Model[]> {
    console.log("token: ", this._authService.token);
      return this.http.get('api/' + this.getResource())
        .switchMap((res: Response) => {
          let body = res.json();
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
        })
        .catch(this.handleError);
  }

  // GET resource specified by id
  get(id: string, options?: any): Observable<Model> {
        return this.http.get('api/' + this.getResource() + '/' + (id || ''))
          .switchMap((res: Response) => {
            let body = res.json();
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
          .catch(this.handleError);
  }

  // DELETE resource specified by id
  delete(id: string): Observable<Model> {
    let headers = new Headers({ 'Authorization': this._authService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.delete('api/' + this.getResource() + '/' + id, options)
      .map((res: Response) => {
        if (res.status === 200 || res.status === 204) {
          // on successful backend deletion,
          // remove the item from our cache
          this.dataStore.items = this.dataStore.items.filter((item: Model) => { return item._id != id; });

          // set the next item to emit in the BehaviorSubject
          this._items.next(
            Object.assign(
              {},
              this.dataStore
            ).items);
        }
      })
      .catch(this.handleError);
  }

  // PUT updated resource specified by id
  update(body: AppModel): Observable<Model> {
    let headers = new Headers({ 'Authorization': this._authService.token });
    let options = new RequestOptions({ headers: headers });
    return this.http.put('api/' + this.getResource() + '/' + body._id, body, options)
      .map((res: Response) => {
        let body = res.json();
        this.editedItem = this.new(body.data);
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
        console.log("_items: ", this._items);
        return this.editedItem;
      });
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
    let headers = new Headers({ 'Authorization': `${this._authService.token}` });
    let options = new RequestOptions({ headers: headers });
    return this.http.post('api/' + this.getResource(), body, options)
      .switchMap((res: Response) => {
        let body = res.json();
        this.newlyCreatedItem = this.new(body.data);
        // insert our newly created item into the cache
        this.dataStore.items.push(this.newlyCreatedItem);

        this._items.next(
          Object.assign(
            {},
            this.dataStore
          ).items);
        return this._items.asObservable();
      })
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    // map res.json
    let body = res.json();
    return body || { };
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

  private handleError(error: any): Observable<any> {
    let errMsg: string;
    if (error instanceof Response) {
      // format error as JSON if not already
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      // create error object if not already created.
      errMsg = error.message ? error.message : {error: error.toString()};
    }
    console.log(errMsg);
    return Observable.of(errMsg);
  }
}
