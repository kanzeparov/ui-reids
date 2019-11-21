import { Component, OnInit } from '@angular/core';
import { DashboardFacade } from './dashboard.facade';

@Component({
  selector: 'mpp-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    DashboardFacade,
  ],
})
export class DashboardComponent implements OnInit {

  constructor(
    private dashboardFacade: DashboardFacade,
  ) {}

  ngOnInit() {
    this.dashboardFacade.init();
  }

}
