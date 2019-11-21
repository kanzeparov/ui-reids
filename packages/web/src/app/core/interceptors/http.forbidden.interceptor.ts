import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class HttpForbiddenInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          localStorage.removeItem('onder.token');
          this.router.navigate(['login']);
        }

        return throwError(error);
      }),
    );
  }
}
