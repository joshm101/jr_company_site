// Thanks to http://jasonwatmore.com/post/2016/08/16/angular-2-jwt-authentication-example-tutorial#auth-guard-ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Router, CanActivate } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _router: Router, private _http: Http, private _authService: AuthService) { }

  canActivate() {
    let headers = new Headers({ 'Authorization': this._authService.token });
    let options = new RequestOptions({ headers: headers });
    return Observable.if(() =>
        localStorage.getItem('jr_jwt') !== null,

        // token exists locally, verify validity with server
        this._http.post('api/auth/tokenvalid', {}, options)
        .map(res => {
          if (res.json()) {
            return true;
          } else {
            this._router.navigate(['/login']);
            return false;
          }
        }),

        // token does not exist locally, no need for server validation call
        Observable.of(false).do(() => {
          this._router.navigate(['/login'])
        })
    )
  }
}
