import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { User } from '@core/models';
import { tap, take } from 'rxjs/operators';
import { UserStore, DashboardStore } from '@core/store';

@Injectable()
export class UserService {

  constructor(
    private http: HttpClient,
    private userStore: UserStore,
    private dashboardStore: DashboardStore,
  ) { }

  protected userApiUrl = `${environment.backendUrl}/api/getCurrentUser`;

  fetchCurrentUser(): Observable<User> {
    const getUserInfo$ = this.http.get(this.userApiUrl) as Observable<User>;
    return getUserInfo$.pipe(
      tap((user: User) => {
        this.userStore.setCurrentUser(user);
        if (user.ethAddress !== 'ADMIN') {
          this.dashboardStore.setActiveEthId(user.ethAddress)
        }
      }),
      take(1),
    );
  }
  
}
