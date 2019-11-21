import { Component, OnInit } from '@angular/core';
import { ModalService } from '@core/services';
import { DashboardService } from '@dashboard/services';

@Component({
  selector: 'mpp-price-modal',
  templateUrl: './price-modal.component.html',
  styleUrls: ['./price-modal.component.scss']
})
export class PriceModalComponent implements OnInit {

  constructor(
    private modalService: ModalService,
    private dashboardService: DashboardService,
  ) { }

  prices!: any[];

  ngOnInit() {
    this.dashboardService.getPrices().subscribe(response => this.prices = response.prices);
  }

  close() {
    this.modalService.close();
  }

  save() {
    this.dashboardService.savePrices(this.prices);
  }

  add() {
    this.prices.push({ amount: null, price: null });
  }

  remove(i: number) {
    this.prices.splice(i, 1);
  }

}
