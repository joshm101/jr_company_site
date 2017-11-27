import { Injectable, Injector } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { AppModel } from './app.model';
import { AuthService } from './components/auth/auth.service';
import { ApiService } from './api.service';
import { CacheService } from './cache.service';

@Injectable()
export abstract class AppService<Model extends AppModel> {
  protected _authService: AuthService;
  private api: ApiService;
  private cacheService: CacheService<Model>;
  private rawGetAllResponse: BehaviorSubject<any>;
  public rawGetAllResponse$: Observable<any>;
  constructor(
    private injector: Injector
  ) {
   // this._authService = Inject(AuthService);
    this._authService = this.injector.get(AuthService);
    this.api = this.injector.get(ApiService);
    this.cacheService = new CacheService<Model>();
    this.rawGetAllResponse = new BehaviorSubject<any>(undefined);
    this.rawGetAllResponse$ = this.rawGetAllResponse.asObservable();
  }

  protected abstract getResource(): string;

  public removeLastItemFromCache() {
    this.cacheService.popFromCache();
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
    ).switchMap((res: any) => {
      this.rawGetAllResponse.next(res);
      let body = res['data'];
      let temp: Model[] = [];
      temp = body.map(item => this.new(item));
      this.cacheService.clearCache();
      this.cacheService.setCache(temp);
      return this.cacheService.items$;
    }).catch(this.api.handleError);
  }

  // GET resource specified by id
  get(id: string, options?: any): Observable<Model> {
    const url = `api/${this.getResource()}/${id || ''}`;
    return this.api.get(
      url
    ).switchMap((res: any) => {
      let body = res['data'];
      let idx;
      let temp: Model = this.new(body);
      this.cacheService.updateCacheItem(temp);
      return this.cacheService.retrieveCacheItemById(temp._id);
    }).catch(this.api.handleError);
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
      this.cacheService.removeFromCache(id);
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
    ).switchMap((res: any) => {
      let body = res['data'];
      console.log("body: ", body);
      this.editedItem = this.new(body);
      this.cacheService.updateCacheItem(this.editedItem);
      return this.cacheService.retrieveCacheItemById(this.editedItem._id);
    }).catch(this.api.handleError);
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
      this.cacheService.prependToCache(this.newlyCreatedItem);
      return this.cacheService.items$;
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

  hasNextPage() {
    if (this.rawGetAllResponse.value) {
      return this.rawGetAllResponse.value.hasNextPage;
    }
    return false;
  }

  hasPreviousPage() {
    if (this.rawGetAllResponse.value) {
      return this.rawGetAllResponse.value.hasPreviousPage;
    }
    return false;
  }

  protected _uploadRequestInFlight: boolean;
  protected _requestInFlight: boolean;

  public newlyCreatedItem: Model;
  public editedItem: Model;
}
