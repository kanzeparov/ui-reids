import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtService } from '@core/services';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.jwtService.getToken();
    let headers = req.headers;

    if (token) {
      const user = this.jwtService.decodeToken(token);

      headers = headers.set('auth', `${token}`);
      if (user) { headers = headers.set('from', user.email); }
    }

    const authReq = req.clone({ headers });
    return next.handle(authReq);
  }
}
