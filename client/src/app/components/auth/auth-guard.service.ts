// Thanks to http://jasonwatmore.com/post/2016/08/16/angular-2-jwt-authentication-example-tutorial#auth-guard-ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router, CanActivate } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private _router: Router, private _http: HttpClient, private _authService: AuthService) { }

  canActivate() {
    let headers = new HttpHeaders({ 'Authorization': this._authService.token });
    let options = { headers };
    return Observable.if(() =>
        localStorage.getItem('jr_jwt') !== null,

        // token exists locally, verify validity with server
        this._http.post('api/auth/tokenvalid', {}, options)
        .map((res: HttpResponse<any>) => {
          if (res) {
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
