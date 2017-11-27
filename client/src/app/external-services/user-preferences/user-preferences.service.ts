import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { ApiService } from '../../api.service';
import { AuthService } from '../../components/auth/auth.service';
import { UserPreferences } from './user-preferences.model';

@Injectable()
export class UserPreferencesService {
  private userPreferences: BehaviorSubject<UserPreferences>;
  public userPreferences$: Observable<UserPreferences>;
  public requestInFlight: boolean;
  constructor(
    private api: ApiService,
    private authService: AuthService
  ) {
    this.userPreferences = new BehaviorSubject<UserPreferences>(undefined);
    this.userPreferences$ = this.userPreferences.asObservable();
  }

  getUserPreferences(): Observable<UserPreferences> {
    this.requestInFlight = true;
    const token = this.authService.token;
    return this.api.get('api/userPreferences', {
      headers: this.constructRequestHeaders()
    }).switchMap(res => {
      let userPreferences = new UserPreferences(res['data']);
      this.userPreferences.next(userPreferences);
      this.requestInFlight = false;
      return this.userPreferences$;
    }).catch(err => this.api.handleError(err));
  }

  updateUserPreferences(userPreferences: UserPreferences): Observable<UserPreferences> {
    this.requestInFlight = true;
    const token = this.authService.token;
    return this.api.put(
      'api/userPreferences', 
      userPreferences, 
      {
        headers: this.constructRequestHeaders()
      }
    ).map(res => {
      let userPreferences = new UserPreferences(res['data']);
      this.userPreferences.next(userPreferences);
      this.requestInFlight = false;
      return this.userPreferences$;
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
