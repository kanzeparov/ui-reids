import { LoadingState } from './loading-state';

export interface User {
  email: string;
  password: string;
  isAdmin: boolean;
  ethAddress: string;
}

export interface UserState {
  loadingState: LoadingState;
  currentUser: User;
}
