import { Component, OnInit } from '@angular/core';
import { ModalService } from '@core/services';
import { DashboardService } from '@dashboard/services';
import { Anchor } from '@dashboard/models';
import { Observable } from 'rxjs';
import { DashboardQuery, UserQuery } from '@core/store';
import { distinctUntilChanged, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'mpp-notarization-modal',
  templateUrl: './notarization-modal.component.html',
  styleUrls: ['./notarization-modal.component.scss']
})
export class NotarizationModalComponent implements OnInit {

  anchors$!: Observable<Anchor[]>;

  notarization$: any = this.dashboardQuery.selectNotarization$;

  private activeEthId$ = this.dashboardQuery.selectActiveEthId$;
  private isCurrentUserAdmin$: Observable<boolean> = this.userQuery.isCurrentUserAdmin$;

  constructor(
    private modalService: ModalService,
    private dashboardService: DashboardService,
    private dashboardQuery: DashboardQuery,
    private userQuery: UserQuery,
  ) { }

  ngOnInit() {
    this.anchors$ = this.getEthId$().pipe(
      switchMap((ethId: string | undefined) => this.dashboardService.loadAnchors(ethId))
    );
  }

  close() {
    this.modalService.close();
  }

  checkNotarization() {
    this.dashboardService.checkNotarization().subscribe();
  }

  private getEthId$(): Observable<string | undefined> {
    return this.activeEthId$.pipe(
      withLatestFrom(this.isCurrentUserAdmin$),
      map(([activeEthId, isCurrentUserAdmin]) => {
        if (isCurrentUserAdmin && activeEthId !== 'ADMIN') {
          return activeEthId;
        }
        return undefined;
      }),
    );
  }

}
