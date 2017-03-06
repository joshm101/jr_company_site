// Thanks to http://jasonwatmore.com/post/2016/08/16/angular-2-jwt-authentication-example-tutorial#auth-guard-ts

import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private _router: Router) { }

  canActivate() {
    if (localStorage.getItem('jr_jwt')) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page
    this._router.navigate(['/login']);
    return false;
  }
}
