import { Query } from '@datorama/akita';
import { Inject } from '@angular/core';
import { LoadingState } from '@core/models';
import { ProductionStore } from './production.store';
import { ProductionState } from '@dashboard/models';

export class ProductionQuery extends Query<ProductionState> {
  constructor(
    @Inject(ProductionStore) protected store: ProductionStore,
  ) {
    super(store);
  }

  selectProduction$ = this.select(state => state.production);

  selectIsLoading$ = this.select(state => state.loadingState === LoadingState.LOADING);
  selectIsLoaded$ = this.select(state => state.loadingState === LoadingState.LOADED);
  selectIsErrored$ = this.select(state => state.loadingState === LoadingState.ERROR);
  selectIsEmpty$ = this.select(state => state.loadingState === LoadingState.EMPTY);

}
