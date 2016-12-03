import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/rx';

@Injectable()
export abstract class AppService<T> {
  constructor(private http: Http) {

  }

  protected abstract getResource(): string;

  // GET all items from requested resource
  getAll(options?: any): Observable<T[]> {
      // get all items
      return this.http.get('api/' + this.getResource())
        .map(this.extractData).catch(this.handleError);
  }

  // GET resource specified by id
  get(id: string, options?: any): Observable<T> {
    return this.http.get('api/' + this.getResource() + '/' + id)
      .map(this.extractData).catch(this.handleError);
  }

  // DELETE resource specified by id
  delete(id: string): Observable<T> {
    return this.http.delete('api/' + this.getResource() + '/' + id)
      .map(this.extractData).catch(this.handleError);
  }

  // PUT updated resource specified by id
  update(id: string, body: T): Observable<T> {
    return this.http.put('api/' + this.getResource() + '/' + id, body)
      .map(this.extractData).catch(this.handleError);
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
