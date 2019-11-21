import { Component, OnInit } from '@angular/core';
import { NavigationTabs, DateRange } from '@dashboard/models';
import { DashboardStore, DashboardQuery } from '@core/store';
import { TransactionService, DashboardService } from '@dashboard/services';
import { UserQuery } from '@core/store';
import { ModalService } from '@core/services';
import { NotarizationModalComponent } from '../modals';
import { map } from 'rxjs/operators';

@Component({
  selector: 'mpp-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {

  dateRange = DateRange.today;
  navigationTab = NavigationTabs.monitoring;

  get navigationTabName(): string {
    return this._navigationTabName;
  }

  set navigationTabName(value: string) {
    this._navigationTabName = value;
  }

  notarization$: any = this.dashboardQuery.selectNotarization$.pipe(
    map((notarization: any) => {
      if (Array.isArray(notarization)) {
        return { success: notarization.every(({ success }) => success), lastChecked: notarization[0].lastChecked };
      }
      return notarization;
    })
  );

  private _navigationTabName!: string;

  constructor(
    private dashboardStore: DashboardStore,
    private dashboardQuery: DashboardQuery,
    private transactionService: TransactionService,
    private userQuery: UserQuery,
    private dashboardService: DashboardService,
    private modalService: ModalService,
  ) {
    this.navigationTabName = 'Market participants';
  }

  ngOnInit() {
    this.dashboardQuery.selectActiveEthId$.subscribe(
      (activeEthId: string) => {
        if (!!activeEthId) {
          this.navigationTabName = 'Peers';
        } else {
          this.navigationTabName = 'Market participants';
        }
      }
    );
  }

  changeDateRange(range: string) {
    this.dashboardStore.setDateRange(range);
  }

  download() {
    this.transactionService.downloadTransactionsExcel().subscribe(response => {
      window.open(response.report);
    });
  }

  closeChannels() {
    this.dashboardService.closeChannels();
  }

  openNotarizationModal() {
    this.modalService.open(NotarizationModalComponent);
  }

}
