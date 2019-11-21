import { Query } from '@datorama/akita';
import { Inject } from '@angular/core';
import { LoadingState } from '@core/models';
import { TransactionStore } from './transaction.store';
import { TransactionState } from '@dashboard/models';

export class TransactionQuery extends Query<TransactionState> {
  constructor(
    @Inject(TransactionStore) protected store: TransactionStore,
  ) {
    super(store);
  }

  selectTransactions$ = this.select(state => state.transactions);


  selectIsLoading$ = this.select(state => state.loadingState === LoadingState.LOADING);
  selectIsLoaded$ = this.select(state => state.loadingState === LoadingState.LOADED);
  selectIsErrored$ = this.select(state => state.loadingState === LoadingState.ERROR);
  selectIsEmpty$ = this.select(state => state.loadingState === LoadingState.EMPTY);

}
