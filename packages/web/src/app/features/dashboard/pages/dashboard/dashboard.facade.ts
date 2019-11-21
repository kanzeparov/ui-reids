import { Injectable } from '@angular/core';
import { distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { DashboardQuery } from '@core/store';
import { DashboardService } from '@dashboard/services';

@Injectable()
export class DashboardFacade {

  private activeEthId$ = this.dashboardQuery.selectActiveEthId$;

  constructor(
    private dashboardQuery: DashboardQuery,
    private dashboardService: DashboardService,
  ) {}

  init() {
    this.activeEthId$.pipe(
      filter((id: string) => !!id),
      distinctUntilChanged(),
      switchMap((id: string) => {
        return this.dashboardService.getCellInfo(id);
      }),
    ).subscribe();

    this.dashboardService.checkNotarization().subscribe();
  }

}
