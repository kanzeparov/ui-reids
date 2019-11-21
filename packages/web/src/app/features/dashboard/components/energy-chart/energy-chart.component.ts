import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription, combineLatest, forkJoin, of, BehaviorSubject, ReplaySubject } from 'rxjs';
import { map, filter, withLatestFrom, switchMap, distinctUntilChanged, tap } from 'rxjs/operators';

import { ChartDataSet, ChartSeriesOptions, ChartValues } from '@chart/models/chart';
import { ChartAction } from '@chart/models/chart-action';
import { ChartPointData } from '@chart/models/chart-data';

import { ChartDataService } from '@chart/services/chart-data.service';
import { formatTime, formatDateTime } from '@utils/datetime.util';
import { Consumption, Energy, Production } from '@dashboard/models';
import { Options, TooltipFormatterContextObject } from 'highcharts';
import { DateTime } from 'luxon';
import { DashboardQuery } from '@core/store';
import { isObjectEmpty } from '@utils/is-empty.util';
import { deepMergeAll } from '@utils/deepmerge.util';
import defaultChartOptions from '@chart/constants/default-chart-options.constant';

@Component({
  selector: 'mpp-energy-chart',
  templateUrl: './energy-chart.component.html',
  styleUrls: ['./energy-chart.component.scss'],
  providers: [
    ChartDataService,
  ],
})
export class EnergyChartComponent implements OnInit, OnDestroy {

  @Input('seriesOptions') customSeriesOptions!: ChartSeriesOptions;
  @Input()
  set data(value: Consumption | Production) {
    console.log('setter');
    this.dataSubject.next(value);
  }

  dataSubject: BehaviorSubject<Consumption | Production> = new BehaviorSubject<Consumption | Production>({} as Consumption | Production);
  data$ = this.dataSubject.asObservable();

  defaultChartConfig = {
    options: {
      chart: {
        type: 'column',
        height: 110,
      },
      xAxis: {
        labels: {
          enabled: true,
          formatter: (p: any) => {
            return `${formatTime(p.value)}`;
          },
        },
      },
      plotOptions: {
        column: {
          pointPadding: 0,
          groupPadding: 0,
          borderWidth: 0,
          grouping: false,
        },
      },
      tooltip: {
        formatter(this: TooltipFormatterContextObject) {
          const date = formatDateTime(this.x, 'HH:mm DD MMM');
          return `${ this.y.toFixed(2) } kW·h <br /> ${date}`;
        },
      },
    },
  };

  get chartConfig() {
    return {
      ...this.defaultChartConfig,
      seriesOptions: [ this.customSeriesOptions ],
    };
  }

  chartActionsSubject$: Subject<ChartAction> = new ReplaySubject<ChartAction>();
  chartActions$: Observable<ChartAction> = this.chartActionsSubject$.asObservable();
  chartData$!: Subscription;

  timestamps: number[] = [];
  points: ChartPointData[] = [];

  constructor(
    private chartData: ChartDataService,
    private dashboardQuery: DashboardQuery,
  ) { }

  ngOnInit() {
    this.chartData$ = combineLatest(
        this.data$,
        this.dashboardQuery.selectActiveDateRange$,
      ).pipe(
        filter(([energy]) => !isObjectEmpty(energy)),
        distinctUntilChanged(),
        map(([energy, dateRange]) => {
          return dateRange === 'today' ? energy.energy_today : energy.energy_30_day;
        }),
        filter((energy: Energy[]) => !!energy),
        map(this.buildChartData),
        map(this.buildAccumulation),
        map(this.saveValuesAndDraw),
      ).subscribe();
  }

  ngOnDestroy() {
    if (this.chartData$) {
      this.chartData$.unsubscribe();
    }
  }

  private buildChartData = (energy: Energy[]) => {
    const data = energy.map(energyItem => {
      return { value: String(energyItem.energy), time: DateTime.fromISO(energyItem.date).toSeconds() };
    });
    return data;
  }

  private buildAccumulation = (items: ChartValues[]): ChartDataSet => {
    return this.chartData.buildAcc(items);
  }

  private saveValuesAndDraw = (accumulation: ChartDataSet) => {
    this.timestamps = accumulation.timestamps;
    this.points = accumulation.points;

    if (accumulation.meta) {
      const chartAction = this.chartData.buildChartAction(
        this.customSeriesOptions.id, accumulation.meta
      );

      this.chartActionsSubject$.next(chartAction);
    }
  }
}
