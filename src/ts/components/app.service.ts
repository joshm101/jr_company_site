import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs/rx';

import { AppModel } from './app.model';

@Injectable()
export abstract class AppService<AppModel> {
  constructor(private http: Http) {
    this.dataStore = { items: [] };
    this._items = <BehaviorSubject<AppModel[]>>new BehaviorSubject([]);
  }

  private dataStore: {
    items: AppModel[]
  };

  private _items: BehaviorSubject<AppModel[]>;

  protected abstract getResource(): string;

  // GET all items from requested resource
  getAll(options?: any): Observable<AppModel[]> {
      return this.http.get('api/' + this.getResource())
        .switchMap((res: Response) => {
          let body = res.json();

          // set all the items
          // retrieved from the backend
          // as our cached set
          this.dataStore.items = body;

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
  get(id: string, options?: any): Observable<AppModel> {
        return this.http.get('api/' + this.getResource() + '/' + id)
          .map(this.extractData)
          .catch(this.handleError)
          .publishReplay(1)
          .refCount();
  }

  // DELETE resource specified by id
  delete(id: string): Observable<AppModel> {
    return this.http.delete('api/' + this.getResource() + '/' + id)
      .map((res: Response) => {
        if (res.status === 200 || res.status === 204) {
          // on successful backend deletion,
          // remove the item from our cache
          this.dataStore.items = this.dataStore.items.filter((item: AppModel) => { return item._id != id; });

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
  update(id: string, body: AppModel): Observable<AppModel> {
    return this.http.put('api/' + this.getResource() + '/' + id, body)
      .map(this.extractData).catch(this.handleError);
  }

  // POST newly created item
  create(body: AppModel): Observable<AppModel[]> {
    return this.http.post('api/' + this.getResource(), body)
      .switchMap((res: Response) => {
        let body = res.json();

        // insert our newly created item into the cache
        this.dataStore.items.push(body.data);
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
