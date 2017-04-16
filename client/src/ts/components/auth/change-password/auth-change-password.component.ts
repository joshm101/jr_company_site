import { Component } from '@angular/core';
import { MdSnackBar } from '@angular/material';

import { AuthService } from '../auth.service';
import { JwtHelper } from 'angular2-jwt';


type PasswordChange = {
  oldPassword: string,
  newPassword: string,
  confirmedPassword: string,
}

@Component({
  selector: 'auth-change-password',
  templateUrl: 'auth-change-password.component.html'
})
export class AuthChangePasswordComponent {
  public passwordChange: PasswordChange;

  constructor(
    private _authService: AuthService,
    private _snackBar: MdSnackBar
  ) {
    this._initForm();
  } 

  private _initForm() {
    this.passwordChange = {
      oldPassword: '',
      newPassword: '',
      confirmedPassword: '',
    };
  }

  public submitPasswordChange() {
    if (this.passwordChange.newPassword !== this.passwordChange.confirmedPassword) {
      // new password must be correctly confirmed
      this._snackBar.open("New password and confirmed password must match.", "", { duration: 3000 });
    } else {
      this._authService.changePassword(this.passwordChange).take(1).subscribe(
        (result) => {
          if (result) {
            this._snackBar.open("Your password was successfully updated.", "", { duration: 3000 });
          }
        },
        (error) => {
          console.error(error);
        }
      )
    }
  }

  public resetForm() {
    this._initForm();
  }
}