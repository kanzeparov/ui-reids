import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services';
import { LoginFormComponent } from './components/login-form/login-form.component';

const COMPONENTS = [
  LoginComponent,
  LoginFormComponent,
];

const SERVICES = [
  AuthService,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    FormsModule,
  ],
  providers: [
    ...SERVICES,
  ],
})
export class AuthModule { }
