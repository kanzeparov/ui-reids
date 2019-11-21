import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './guards';
import { MainLayoutComponent } from './layouts';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [ AuthGuard ],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () => import('@dashboard/dashboard.module').then(mod => mod.DashboardModule),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {}
