import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '@core/services';
import { EnergyModalComponent, PriceModalComponent } from '@dashboard/components';
import { DashboardQuery, DashboardStore, UserQuery } from '@core/store';
import { withLatestFrom, map, filter } from 'rxjs/operators';
import { resetStores } from '@datorama/akita';
@Component({
  selector: 'mpp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  cell$ = this.dashboardQuery.selectCellInfo$;
  currentUser$ = this.userQuery.selectCurrentUser$;

  energyStorageInfo$ = combineLatest(
    this.cell$,
    this.dashboardQuery.selectActiveEthId$,
  ).pipe(
    map(([cell, ethId]) => {
      console.log(ethId);
      if (ethId) {
        return { ...cell, ethId };
      }
      return undefined;
    }),
  );

  constructor(
    private router: Router,
    private modalService: ModalService,
    private dashboardQuery: DashboardQuery,
    private dashboardStore: DashboardStore,
    private userQuery: UserQuery,
  ) { }

  ngOnInit() {}

  logout() {
    localStorage.removeItem('onder.token');
    this.router.navigate(['login']);
    resetStores();
  }

  backToList() {
    this.dashboardStore.removeActiveEthId();
  }

  openEnergySettings() {
    this.modalService.open(EnergyModalComponent);
  }

  openPriceSettings() {
    this.modalService.open(PriceModalComponent);
  }

}

import { combineLatest } from 'rxjs';
