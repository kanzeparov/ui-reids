import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription, combineLatest, Observable, ReplaySubject, BehaviorSubject } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';

import { ChartDataSet, ChartSeriesOptions, ChartValues } from '@chart/models/chart';
import { ChartAction } from '@chart/models/chart-action';
import { ChartPointData } from '@chart/models/chart-data';

import { ChartDataService } from '@chart/services/chart-data.service';
import { formatTime, formatDateTime } from '@utils/datetime.util';
import { TooltipFormatterContextObject } from 'highcharts';
import { Consumption, Price, Production } from '@dashboard/models';
import { DateTime } from 'luxon';
import { DashboardQuery } from '@core/store';

@Component({
  selector: 'mpp-price-chart',
  templateUrl: './price-chart.component.html',
  styleUrls: ['./price-chart.component.scss'],
  providers: [
    ChartDataService,
  ],
})
export class PriceChartComponent implements OnInit, OnDestroy {

  @Input('seriesOptions') customSeriesOptions!: ChartSeriesOptions;
  @Input()
  set data(value: Consumption | Production) {
    this.dataSubject.next(value);
  }

  dataSubject: BehaviorSubject<Consumption | Production> = new BehaviorSubject<Consumption | Production>({} as Consumption | Production);
  data$ = this.dataSubject.asObservable();

  defaultChartConfig = {
    options: {
      chart: {
        type: 'line',
        height: 110,
        marginBottom: 30,
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
        series: {
          states: {
            hover: {
              halo: { size: 0 },
            },
          },
        },
        line: {
          marker: {
            enabled: false,
            states: {
              hover: {
                radius: 3,
                fillColor: 'black',
                lineWidth: 0,
                lineWidthPlus: 0,
              }
            }
          }
        },
      },
      tooltip: {
        formatter(this: TooltipFormatterContextObject) {
          const date = formatDateTime(this.x, 'HH:mm DD MMM');
          return `${ this.y.toFixed(3) } REIDSCoin / kW·h <br/> ${date}`;
        },
      }
    }
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
        map(([price, dateRange]) => {
          return dateRange === 'today' ? price.price_today : price.price_30_day;
        }),
        distinctUntilChanged(),
        filter((price: Price[]) => !!price),
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

  buildAccumulation = (items: ChartValues[]) => {
    return this.chartData.buildAcc(items);
  }

  buildChartData = (price: Price[]) => {
    const data = price.map(priceItem => {
      return { value: String(priceItem.price), time: DateTime.fromISO(priceItem.date).toSeconds() };
    });
    return data;
  }

  saveValuesAndDraw = (accumulation: ChartDataSet) => {
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
