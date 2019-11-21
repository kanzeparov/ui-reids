import { Injectable } from '@angular/core';
import { merge, Observable, Subscription } from 'rxjs';
import { map, withLatestFrom, mergeMap, last, takeLast, distinctUntilChanged } from 'rxjs/operators';
import { ConsumptionService, ProductionService } from '@dashboard/services';
import { DashboardQuery } from '@core/store';
import { UserQuery } from '@core/store';

@Injectable()
export class MonitoringFacade {

  private activeEthId$: Observable<string> = this.dashboardQuery.selectActiveEthId$;
  private isCurrentUserAdmin$: Observable<boolean> = this.userQuery.isCurrentUserAdmin$;
  private monitoring$!: Subscription;

  constructor(
    private consumptionService: ConsumptionService,
    private productionService: ProductionService,
    private dashboardQuery: DashboardQuery,
    private userQuery: UserQuery,
  ) {}

  init() {
    if (this.monitoring$) {
      this.monitoring$.unsubscribe();
    }
    this.monitoring$ = this.getEthId$().pipe(
      distinctUntilChanged(),
      mergeMap((ethId: string | undefined) => {
        return merge(
          this.productionService.fetchProduction(ethId),
          this.consumptionService.fetchConsumption(ethId),
        );
      }),
    ).subscribe();
  }

  // energyStorageType$ = (type: string): Observable<boolean> => {
  //   return this.selectCellInfo$.pipe(
  //     // filter((cell: Cell | undefined) => !!cell),
  //     map((cell: Cell | undefined) => {
  //       debugger
  //       if (cell) {
  //         return cell.cellType === type || cell.cellType === 'prosumer';
  //       }
  //       return false;
  //     }),
  //     take(1),
  //   );
  // }

  private getEthId$(): Observable<string | undefined> {
    return this.activeEthId$.pipe(
      withLatestFrom(this.isCurrentUserAdmin$),
      distinctUntilChanged(),
      map(([activeEthId, isCurrentUserAdmin]) => {
        console.log(activeEthId, isCurrentUserAdmin)
        if (isCurrentUserAdmin && activeEthId !== 'ADMIN') {
          return activeEthId;
        }
        return undefined;
      }),
    );
  }

}
