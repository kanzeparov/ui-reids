import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Consumption, Production } from '@dashboard/models';
import { ConsumptionQuery, DashboardQuery, ProductionQuery, UserQuery } from '@core/store';
import { MonitoringFacade } from './monitoring.facade';
import { isObjectEmpty } from '@utils/is-empty.util';
import { User } from '@core/models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'mpp-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss'],
  providers: [
    MonitoringFacade,
  ]
})
export class MonitoringComponent implements OnInit {

  consumption$: Observable<Consumption | undefined> = this.consumptionQuery.selectConsumption$;
  production$: Observable<Production | undefined> = this.productionQuery.selectProduction$;
  tableName$: Observable<any> = this.dashboardQuery.selectActiveEthId$.pipe(
    map((selectActiveEthId: string) => {
      if (selectActiveEthId) {
        return {
          production: 'Peers',
          consumption: 'Peers',
        };
      }
      return {
        production: 'Producers',
        consumption: 'Consumers',
      };
    })
  );

  constructor(
    private consumptionQuery: ConsumptionQuery,
    private productionQuery: ProductionQuery,
    private monitoringFacade: MonitoringFacade,
    private userQuery: UserQuery,
    private dashboardQuery: DashboardQuery,
  ) { }

  ngOnInit() {
    this.monitoringFacade.init();
  }

  isEmpty(object: Consumption | Production) {
    return isObjectEmpty(object);
  }

}
