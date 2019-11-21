import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '@shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { DashboardComponent, TransactionsComponent, MonitoringComponent } from './pages';

import { FormatHashPipe, FormatPowerPipe, FormatDatePipe, FormatDatetimePipe } from '@dashboard/pipes';
import {
  TransactionService,
  ConsumptionService,
  ProductionService,
  DashboardService,
} from './services';

import {
  ActionsComponent,
  TableComponent,
  PriceChartComponent,
  EnergyChartComponent,
  TransactionsTableComponent,
  EnergyModalComponent,
  PriceModalComponent,
  NotarizationModalComponent,
  AnchorsTableComponent,
  ConsumptionChartsComponent,
  ProductionChartsComponent,
} from './components';

import { ChartModule } from '@chart/chart.module';

const PIPES = [
  FormatPowerPipe,
  FormatDatePipe,
  FormatDatetimePipe,
  FormatHashPipe,
];

const SERVICES = [
  TransactionService,
  ConsumptionService,
  ProductionService,
  DashboardService,
];

const MODALS = [
  NotarizationModalComponent,
  PriceModalComponent,
  EnergyModalComponent,
]

const COMPONENTS = [
  DashboardComponent,
  ActionsComponent,
  TableComponent,
  EnergyChartComponent,
  PriceChartComponent,
  TransactionsComponent,
  TransactionsTableComponent,
  MonitoringComponent,
  AnchorsTableComponent,
  ConsumptionChartsComponent,
  ProductionChartsComponent,
  ...MODALS,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...PIPES,
  ],
  exports: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,

    SharedModule,
    ChartModule,

    DashboardRoutingModule,
  ],
  entryComponents: [
    ...MODALS,
  ],
  providers: [
    ...SERVICES,
    ...PIPES,
  ],
})
export class DashboardModule { }
