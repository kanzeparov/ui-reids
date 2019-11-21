import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule as AngularChartModule } from 'angular-highcharts';

import { ChartComponent } from './components/chart/chart.component';
import { ChartService, ChartDataService } from './services';

const SERVICES = [
  ChartService,
  ChartDataService
]

@NgModule({
  declarations: [
    ChartComponent
  ],
  imports: [
    CommonModule,
    AngularChartModule,
  ],
  exports: [
    ChartComponent,
  ],
  providers: [
    ...SERVICES,
  ]
})
export class ChartModule { }
