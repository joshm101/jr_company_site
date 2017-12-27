import { Injectable, Injector } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { JwtHelper } from 'angular2-jwt';

import { authOptionsProvider } from './auth-options.service';

type Credentials = {
  username: string,
  password: string
};

type PasswordChange = {
  oldPassword: string,
  newPassword: string,
  confirmedPassword: string,
}

@Injectable()
export class AuthService {
  private _http: HttpClient;
  constructor(
    injector: Injector
  ) {
      setTimeout(() => this._http = injector.get(HttpClient));
  }

  login(credentials: Credentials): Observable<boolean> {
    return this._http.post('api/auth/login', credentials)
      .map((res: Object) => res['token']).filter(token => !!token)
      .map(token => {
        if (token) {
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

  changePassword(changeInfo: PasswordChange) {
    let uid = this.decodedToken['uid'];
    if (changeInfo.newPassword !== changeInfo.confirmedPassword) {
      return Observable.of(false);
    }
    if (this.decodedToken['uid'] && this.decodedToken['uid'].length > 0) {
      // token's uid field exists
      let headers = new HttpHeaders({ 'Authorization': `${this.token}` });
      let options = { headers: headers };
      return this._http.post(`api/auth/changepassword/${uid}`, changeInfo, options)
        .map(res => {
          if (res) {
            return true;
          } else {
            return false;
          }
        }).catch(this.handleError);
    }
  }

  get token() {
    return localStorage.getItem('jr_jwt');
  }

  get decodedToken() {
      let jwtHelper = new JwtHelper();
      return jwtHelper.decodeToken(this.token);
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
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
