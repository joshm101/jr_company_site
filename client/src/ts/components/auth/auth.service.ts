import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { authOptionsProvider } from './auth.options';

type Credentials = {
  username: string,
  password: string
};

@Injectable()
export class AuthService {
  constructor(
    private _http: Http,
  ) { }

  login(credentials: Credentials): Observable<boolean> {
    return this._http.post('api/auth/login', credentials)
      .map(res => res.json()).filter(token => !!token)
      .map(token => {
        if (token) {
          console.log("token: ", token);
          localStorage.setItem('jr_jwt', token);
          return true;
        } else {
          return false;
        }
      }).catch(this.handleError);
  }

  logout(): Observable<boolean> {
      localStorage.removeItem('jr_jwt');
      return Observable.of(true);
  }

  get token() {
    console.log('token: ', localStorage.getItem('jr_jwt'));
    return localStorage.getItem('jr_jwt');
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
