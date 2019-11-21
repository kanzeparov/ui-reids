import { Component } from '@angular/core';
import { AuthService } from '../../services';
import { AuthParams } from '@auth/models';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {

  constructor(
    private authService: AuthService,
  ) { }

  email = '';
  password = '';

  onSubmit() {
    const params: AuthParams = {
      email: this.email,
      password: this.password,
    }
    this.authService.login(params);
  }

}
