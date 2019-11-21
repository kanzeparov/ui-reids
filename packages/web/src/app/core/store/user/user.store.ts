import { action, Store, StoreConfig } from '@datorama/akita';
import { LoadingState, UserState, User } from '@core/models';

const INITIAL_STATE: UserState = {
  loadingState: LoadingState.EMPTY,
  currentUser: {} as User,
};

@StoreConfig({ 
  name: 'user',
  resettable: true,
})
export class UserStore extends Store<UserState> {
  constructor() {
    super(INITIAL_STATE);
  }

  setLoading() {
    this.update({ loadingState: LoadingState.LOADING });
  }

  @action('Set current user')
  setCurrentUser(currentUser: User) {
    const updates = {
      currentUser,
      loadingState: LoadingState.LOADED,
    };
    this.update(updates);
  }

}
