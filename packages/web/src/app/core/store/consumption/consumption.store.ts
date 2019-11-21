import { action, Store, StoreConfig } from '@datorama/akita';
import { LoadingState } from '@core/models';
import { ConsumptionState, Consumption } from '@dashboard/models';

const INITIAL_STATE: ConsumptionState = {
  loadingState: LoadingState.EMPTY,
  consumption: undefined,
};

@StoreConfig({
  name: 'consumption',
  resettable: true,
})
export class ConsumptionStore extends Store<ConsumptionState> {
  constructor() {
    super(INITIAL_STATE);
  }

  setLoading() {
    this.update({ loadingState: LoadingState.LOADING });
  }

  @action('Set consumption')
  setConsumption(consumption: Consumption) {
    const updates = {
      consumption,
      loadingState: LoadingState.LOADED,
    };
    this.update(updates);
  }

}
