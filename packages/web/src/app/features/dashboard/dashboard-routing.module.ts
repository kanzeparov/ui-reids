import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent, MonitoringComponent, TransactionsComponent } from './pages';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'monitoring',
        pathMatch: 'full',
      },
      {
        path: 'monitoring',
        component: MonitoringComponent,
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
