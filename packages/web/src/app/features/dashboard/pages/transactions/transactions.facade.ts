import { Injectable } from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { switchMap, map, withLatestFrom, filter, distinctUntilChanged } from 'rxjs/operators';
import { TransactionService } from '@dashboard/services';
import { DashboardQuery } from '@core/store';
import { UserQuery } from '@core/store';
import { isObjectEmpty } from '@utils/is-empty.util';
import { Energy } from '@dashboard/models';

@Injectable()
export class TransactionsFacade {

  private activeEthId$: Observable<string> = this.dashboardQuery.selectActiveEthId$;
  private isCurrentUserAdmin$: Observable<boolean> = this.userQuery.isCurrentUserAdmin$;
  private transactions$!: Subscription;

  constructor(
    private transactionsService: TransactionService,
    private dashboardQuery: DashboardQuery,
    private userQuery: UserQuery,
  ) { }

  init() {
    if (this.transactions$) {
      this.transactions$.unsubscribe();
    }
    this.transactions$ = this.getEthId$().pipe(
      switchMap((ethId: string | undefined) => this.transactionsService.fetchTransactions(ethId)),
    ).subscribe();
  }

  private getEthId$(): Observable<string | undefined> {
    return this.activeEthId$.pipe(
      withLatestFrom(this.isCurrentUserAdmin$),
      map(([activeEthId, isCurrentUserAdmin]) => {
        if (isCurrentUserAdmin && activeEthId !== 'ADMIN') {
          return activeEthId;
        }
        return undefined;
      }),
    );
  }

}
