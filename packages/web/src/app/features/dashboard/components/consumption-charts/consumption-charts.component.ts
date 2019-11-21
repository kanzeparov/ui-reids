import { Component, Input, OnInit } from '@angular/core';
import { Consumption, Energy } from '@dashboard/models';
import { ChartSeriesOptions } from '@chart/models/chart';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { isObjectEmpty } from '@utils/is-empty.util';
import { DashboardQuery } from '@core/store';

@Component({
  selector: 'mpp-consumption-charts',
  templateUrl: './consumption-charts.component.html',
  styleUrls: ['./consumption-charts.component.scss'],
})
export class ConsumptionChartsComponent implements OnInit {

  SERIES_ID = 'consumption';

  @Input()
  set consumption(consumption: Consumption) {
    this.dataSub.next(consumption);
    this._consumption = consumption;
  }

  get consumption() {
    return this._consumption;
  }

  _consumption!: Consumption;

  dataSub = new BehaviorSubject<Consumption>({} as Consumption);
  data$ = this.dataSub.asObservable();

  energyData$!: Observable<any>;

  seriesOptions: ChartSeriesOptions = { data: [], id: this.SERIES_ID, color: '#C29C24' };

  constructor(
    private dashboardQuery: DashboardQuery,
  ) { }

  ngOnInit() {
    this.energyData$ = combineLatest(
      this.data$,
      this.dashboardQuery.selectActiveDateRange$,
    ).pipe(
      distinctUntilChanged(),
      map(([energy, dateRange]) => {
        return dateRange === 'today' ? energy.today : energy[30];
      }),
    );
  }

}
