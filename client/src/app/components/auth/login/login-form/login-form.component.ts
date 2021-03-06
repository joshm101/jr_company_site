import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { AuthService } from '../../auth.service';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  public loginForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _snackbar: MatSnackBar,
  ) {
    this.loginForm = _fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  loginFormSubmit(event: Event) {
    event.preventDefault();
    let credentials = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };
    this._authService.login(credentials).subscribe(
      (success) => {
        this._router.navigate(['interface/audio', { contentType: 0 }]);
      },
      (error) => {
        this._snackbar.open('Incorrect credentials.', '', { duration: 3000 });
      }
    )
  }
}
