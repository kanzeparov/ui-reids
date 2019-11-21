import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { Chart as AngularHighcharts } from 'angular-highcharts';
import { Chart, Options } from 'highcharts';

import { ChartService } from '@chart/services/chart.service';
import { ChartAction } from '@chart/models/chart-action';

import { deepMergeAll } from '@utils/deepmerge.util';

import defaultChartOptions from '@chart/constants/default-chart-options.constant';

@Component({
  selector: 'mpp-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @Input('options') customChartOptions: object = {};
  @Input('seriesOptions') customSeriesOptions: object = {};
  @Input('actions') chartActions$!: Observable<ChartAction>;

  chart$!: AngularHighcharts;

  get chartOptions(): Options {
    return deepMergeAll([
      defaultChartOptions,
      this.customChartOptions,
      { series: this.customSeriesOptions },
    ]);
  }

  constructor(
    private chartService: ChartService
  ) { }

  ngOnInit() {
    this.chart$ = new AngularHighcharts(this.chartOptions);
    this.chart$.ref$.subscribe(this.drawChart);
  }

  drawChart = (chart: Chart) => {
    this.chartActions$.subscribe(
      action => { this.chartService.drawFromActions(chart, action); }
    );
  }
}
