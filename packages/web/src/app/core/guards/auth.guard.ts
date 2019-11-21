import { Injectable } from '@angular/core';
import { CanActivate, Router, } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtService } from '../services';
import { User } from '@core/models';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const token = this.jwtService.getToken();
    return of(token).pipe(
      map(token => {
        if (!token) {
          this.router.navigate(['/login']);
          return false;
        }

        return true;
      }),
    );
  }
}

