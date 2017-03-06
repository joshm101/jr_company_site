import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { AuthService } from '../../auth.service';

@Component({
  selector: 'auth-login-form',
  templateUrl: 'ts/components/auth/login/form/auth-login-form.component.html'
})
export class AuthLoginFormComponent {
  public loginForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _snackbar: MdSnackBar,
  ) {
    this.loginForm = _fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  loginFormSubmit() {
    let credentials = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };
    this._authService.login(credentials).subscribe(
      (success) => {
        this._router.navigate(['interface/music', { contentType: 0 }]);
      },
      (error) => {
        this._snackbar.open('Incorrect credentials.', '', { duration: 3000 });
      }
    )
  }
}
