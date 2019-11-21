import { Query } from '@datorama/akita';
import { Inject } from '@angular/core';
import { ConsumptionStore } from './consumption.store';
import { ConsumptionState } from '@dashboard/models';

export class ConsumptionQuery extends Query<ConsumptionState> {
  constructor(
    @Inject(ConsumptionStore) protected store: ConsumptionStore,
  ) {
    super(store);
  }

  selectConsumption$ = this.select(state => state.consumption);

}
