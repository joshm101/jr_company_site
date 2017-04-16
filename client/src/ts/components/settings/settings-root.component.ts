import { Component } from "@angular/core";
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { ScreenSizeService } from '../../external_services/screen-size/screen-size.service';

@Component({
  selector: 'settings-root',
  templateUrl: 'settings-root.component.html'
})
export class SettingsRootComponent {
  public currentWidth: number;

  constructor(
    private _authService: AuthService,
    private _screenSizeService: ScreenSizeService,
    private _router: Router,
  ) {
    this.currentWidth = this._screenSizeService.screenWidth;
  }

  public onResize() {
    this.currentWidth = this._screenSizeService.screenWidth;
  }

  public logout() {
    this._authService.logout().take(1).subscribe(
      (success) => {
        this._router.navigate(['/']);
      },
      (error) => {
        console.error(error);
      }
    )
  }

  public goToInterface() {
    this._router.navigate(['/interface/music', { contentType: 0 }]);
  }
}