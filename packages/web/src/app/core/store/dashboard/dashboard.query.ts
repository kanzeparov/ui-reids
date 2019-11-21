import { Query } from '@datorama/akita';
import { Inject } from '@angular/core';
import { DashboardState } from '@dashboard/models';
import { DashboardStore } from './dashboard.store';
import { map } from 'rxjs/operators';

export class DashboardQuery extends Query<DashboardState> {
  constructor(
    @Inject(DashboardStore) protected store: DashboardStore,
  ) {
    super(store);
  }

  selectActiveDateRange$ = this.select(({ dateRange }) => dateRange);

  selectActiveEthId$ = this.select(({ activeEthId }) => activeEthId).pipe(
    map((id: string | undefined) => id ? id : ''),
  );

  selectCellInfo$ = this.select(({ cell }) => cell);

  selectNotarization$ = this.select(({ notarization }) => notarization);

}
