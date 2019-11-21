import { Component, OnInit, Input } from '@angular/core';
import { Consumption, ConsumptionPeer, Production, ProductionPeer } from '@dashboard/models';
import { DashboardQuery, UserQuery } from '@core/store';
import { DashboardStore } from '@core/store';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
  selector: 'mpp-peers-table',
  templateUrl: './peers-table.component.html',
  styleUrls: ['./peers-table.component.scss']
})
export class TableComponent implements OnInit {

  @Input()
  set data(value: Consumption | Production) {
    this.dataSubject.next(value);
  }

  dataSubject: BehaviorSubject<Consumption | Production> = new BehaviorSubject<Consumption | Production>({} as Consumption | Production);
  data$ = this.dataSubject.asObservable();

  peers$!: Observable<ConsumptionPeer[] | ProductionPeer[]>;

  constructor(
    private userQuery: UserQuery,
    private dashboardStore: DashboardStore,
    private dashboardQuery: DashboardQuery,
  ) { }

  ngOnInit() {
    this.peers$ = combineLatest(
      this.data$,
      this.dashboardQuery.selectActiveDateRange$,
    ).pipe(
      distinctUntilChanged(),
      map(([data, dateRange]) => {
        console.log(data);
        return dateRange === 'today' ? data.peers_today : data.peers_30_days;
      }),
      // filter((energy: Energy[]) => !!energy),
    );
  }

  navigateTo(ethId: string) {
    this.dashboardStore.setActiveEthId(ethId);
  }

}
