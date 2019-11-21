import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardQuery, TransactionQuery } from '@core/store';
import { TransactionsFacade } from './transactions.facade';
import { map, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'mpp-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  providers: [
    TransactionsFacade,
  ]
})
export class TransactionsComponent implements OnInit {

  transactions$: Observable<any> = this.transactionQuery.selectTransactions$.pipe(
    withLatestFrom(this.dashboardQuery.selectActiveDateRange$),
    map(([transactions, dateRange]) => {
      return dateRange === 'today' ? transactions.transaction_today : transactions.transaction_30_days;
    })
  );

  constructor(
    private transactionQuery: TransactionQuery,
    private transactionsFacade: TransactionsFacade,
    private dashboardQuery: DashboardQuery,
  ) { }

  ngOnInit() {
    this.transactionsFacade.init();
  }

}
