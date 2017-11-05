import { Component } from "@angular/core";
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { ScreenSizeService } from '../../external-services/screen-size/screen-size.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

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
    this._router.navigate(['/interface/audio', { contentType: 0 }]);
  }

}
