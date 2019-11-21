import { Injectable } from '@angular/core';
import { environment } from '@env';
import { HttpClient } from '@angular/common/http';
import { AuthParams, AuthResult } from '@auth/models';
import { Observable, BehaviorSubject } from 'rxjs';
import { JwtService } from '@core/services';
import { Router } from '@angular/router';
import { UserStore } from '@core/store';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private router: Router,
    private userStore: UserStore,
  ) { }

  protected authApiUrl = `${environment.backendUrl}/api/login`;

  login(params: AuthParams) {
    return this.login$(params)
      .subscribe((response: AuthResult) => {
        this.jwtService.saveToken(response.token);
        this.router.navigate(['/dashboard']);
      });
  }

  private login$(params: AuthParams): Observable<AuthResult> {
    return this.http.post(this.authApiUrl, params) as Observable<AuthResult>;
  }
}
