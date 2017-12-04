import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { ApiService } from '../../api.service';
import { AuthService } from '../../components/auth/auth.service';

@Injectable()
export class ConfigService {
  private config: BehaviorSubject<any>;
  public config$: Observable<any>;
  constructor(
    private api: ApiService,
    private authService: AuthService,
  ) {
    this.config = new BehaviorSubject<any>(undefined);
    this.config$ = this.config.asObservable();
  }

  getConfig(): Observable<any> {
    return this.api.get('api/config').switchMap(res => {
      this.config.next(res['data']);
      return this.config$;
    }).catch(err => this.api.handleError(err));
  }

  updateConfig(config: any): Observable<any> {
    return this.api.put(
      'api/config', 
      config,
      {
        headers: this.constructRequestHeaders()
      }
    ).switchMap(res => {
      this.config.next(res['data']);
      return this.config$;
    }).catch(err => this.api.handleError(err));
  }

  private constructRequestHeaders() {
    const token = this.authService.token;
    return [
      {
        key: 'Authorization',
        value: token
      }
    ];
  }
}
