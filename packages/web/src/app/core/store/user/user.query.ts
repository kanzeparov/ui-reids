import { Query } from '@datorama/akita';
import { Inject } from '@angular/core';
import { LoadingState, UserState, User } from '@core/models';
import { UserStore } from './user.store';
import { map } from 'rxjs/operators';

export class UserQuery extends Query<UserState> {
  constructor(
    @Inject(UserStore) protected store: UserStore,
  ) {
    super(store);
  }

  selectCurrentUser$ = this.select(state => state.currentUser);

  selectCurrentUser = this.getValue().currentUser;
  
  isCurrentUserAdmin = this.selectCurrentUser.isAdmin;

  isCurrentUserAdmin$ = this.selectCurrentUser$.pipe(map((user: User) => user.isAdmin));


  selectIsLoading$ = this.select(state => state.loadingState === LoadingState.LOADING);
  selectIsLoaded$ = this.select(state => state.loadingState === LoadingState.LOADED);
  selectIsErrored$ = this.select(state => state.loadingState === LoadingState.ERROR);
  selectIsEmpty$ = this.select(state => state.loadingState === LoadingState.EMPTY);

}
