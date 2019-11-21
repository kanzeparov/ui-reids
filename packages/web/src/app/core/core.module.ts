import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';
import { AuthModule } from '@auth/auth.module';
import { DashboardModule } from '@dashboard/dashboard.module';

import { environment } from '@env';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreRoutingModule } from './core-routing.module';
import { AuthGuard } from './guards';
import { HttpTokenInterceptor, HttpForbiddenInterceptor } from './interceptors';
import { JwtService, UserService, DomService, ModalService } from './services';

import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { HeaderComponent } from './components';
import { MainLayoutComponent } from './layouts';
import { BootstrapModule } from '@bootstrap/bootstrap.module';
import { 
  UserStore, 
  UserQuery, 
  DashboardStore, 
  DashboardQuery, 
  ConsumptionQuery, 
  ConsumptionStore, 
  ProductionStore, 
  ProductionQuery, 
  TransactionStore, 
  TransactionQuery 
} from './store';

const MODULES = [
  CommonModule,
  RouterModule,
  BrowserAnimationsModule,
  FormsModule,
  HttpClientModule,
  BootstrapModule,
  CoreRoutingModule,
  SharedModule,
  DashboardModule,
  AuthModule,
  [environment.production ? [] : AkitaNgDevtools.forRoot()],
];

const SERVICES = [
  JwtService,
  UserService,
  DomService,
  ModalService,
];

const INTERCEPTORS = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpForbiddenInterceptor, multi: true },
];

const COMPONENTS = [
  HeaderComponent,
  MainLayoutComponent,
]

const STORE = [
  UserStore,
  UserQuery,

  DashboardStore,
  DashboardQuery,

  ConsumptionStore,
  ConsumptionQuery,

  ProductionStore,
  ProductionQuery,

  TransactionStore,
  TransactionQuery,
];

const GUARDS = [
  AuthGuard,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    ...MODULES,
  ],
  providers: [
    ...INTERCEPTORS,
    ...SERVICES,
    ...STORE,
    ...GUARDS,
  ],
})
export class CoreModule {
  constructor() {}
}
