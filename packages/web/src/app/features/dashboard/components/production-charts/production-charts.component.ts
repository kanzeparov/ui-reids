import { Component, Input, OnInit } from '@angular/core';
import { Cell, Consumption, Production } from '@dashboard/models';
import { ChartSeriesOptions } from '@chart/models/chart';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { DashboardQuery } from '@core/store';

@Component({
  selector: 'mpp-production-charts',
  templateUrl: './production-charts.component.html',
  styleUrls: ['./production-charts.component.scss']
})
export class ProductionChartsComponent implements OnInit {

  SERIES_ID = 'production';

  @Input()
  set production(production: Production) {
    this.dataSub.next(production);
    this._production = production;
  }

  get production() {
    return this._production;
  }

  _production!: Production;

  dataSub = new BehaviorSubject<Production>({} as Production);
  data$ = this.dataSub.asObservable();

  energyData$!: Observable<any>;

  seriesOptions: ChartSeriesOptions = { data: [], id: this.SERIES_ID, color: '#8AB65A' };

  chartTitle$: Observable<string> = this.dashboardQuery.selectCellInfo$.pipe(
    map((cell: Cell | undefined) => {
      if (cell) {
        if (cell.cellType === 'prosumer') {
          return 'Energy';
        }
      }
      return 'Production';
    })
  );

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
