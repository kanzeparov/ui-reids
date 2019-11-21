import { Injectable } from '@angular/core';

@Injectable()
export class JwtService {
  private token: string | null = null;

  private urlBase64Decode(str: string) {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        // tslint:disable-next-line:no-string-throw
        throw 'Illegal base64url string!';
    }
    return decodeURIComponent((<any>window).escape(window.atob(output)));
  }

  public decodeToken(token: string = '') {
    if (token === null || token === '') { return { 'upn': '' }; }
    const parts = token.split('.');
    if (parts.length !== 3) {

      throw new Error('JWT must have 3 parts');
    }
    const decoded = this.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode the token');
    }
    return JSON.parse(decoded);
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string | null {
    let token = this.token;
    token = token || window.localStorage['onder.token'];
    if (token === 'null') {
      token = null;
    }

    return token ? token.replace(/"/g, '') : token;
  }

  saveToken(token: string) {
    window.localStorage['onder.token'] = token;
  }

  destroyToken() {
    this.token = null;
    window.localStorage.removeItem('onder.token');
  }
}
