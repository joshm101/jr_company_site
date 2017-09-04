import { Injectable } from '@angular/core';
import { BaseRequestOptions, RequestOptions } from '@angular/http';

import { AuthService } from './auth.service';

@Injectable()
export class AuthOptions extends BaseRequestOptions {
  constructor(private _authService: AuthService) {
    super();

    // Set the 'Authorization' header
    this.headers.set('Authorization', `Bearer ${_authService.token}`);
  }
}

export const authOptionsProvider = { provide: RequestOptions, useClass: AuthOptions };
