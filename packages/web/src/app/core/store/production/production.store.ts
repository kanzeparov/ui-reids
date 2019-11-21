import { action, Store, StoreConfig } from '@datorama/akita';
import { LoadingState } from '@core/models';
import { ProductionState, Production } from '@dashboard/models';

const INITIAL_STATE: ProductionState = {
  loadingState: LoadingState.EMPTY,
  production: undefined,
};

const deleteAndReturn = (obj: any, key: string): any  => {
  const value = obj[key];
  delete obj[key];
  return value;
};

@StoreConfig({
  name: 'production',
  resettable: true,
})
export class ProductionStore extends Store<ProductionState> {
  constructor() {
    super(INITIAL_STATE);
  }

  setLoading() {
    this.update({ loadingState: LoadingState.LOADING });
  }

  @action('Set production')
  setProduction(production: Production) {
    const updates = {
      production,
      loadingState: LoadingState.LOADED,
    };
    this.update(updates);
  }

}
