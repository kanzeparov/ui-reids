import { Component, OnInit } from '@angular/core';
import { ModalService } from '@core/services';
import { DashboardService } from '@dashboard/services';

@Component({
  selector: 'mpp-energy-modal',
  templateUrl: './energy-modal.component.html',
  styleUrls: ['./energy-modal.component.scss']
})
export class EnergyModalComponent implements OnInit {

  margin = 0;

  constructor(
    private modalService: ModalService,
    private dashboardService: DashboardService,
  ) { }

  ngOnInit() {
  }

  close() {
    this.modalService.close();
  }

  save() {
    this.dashboardService.saveMargin(this.margin);
  }

}
