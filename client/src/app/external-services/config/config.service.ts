import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { ApiService } from '../../api.service';

@Injectable()
export class ConfigService {
  private config: BehaviorSubject<any>;
  public config$: Observable<any>;
  constructor(
    private api: ApiService
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
}
