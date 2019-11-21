import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env';
import { Observable } from 'rxjs';
import { Price, Anchor, Cell } from '@dashboard/models';
import { map, take, tap } from 'rxjs/operators';
import { DashboardStore } from '@core/store';

@Injectable()
export class DashboardService {

  constructor(
    private http: HttpClient,
    private dashboardStore: DashboardStore,
  ) { }

  protected apiUrl = `${environment.backendUrl}/api`;

  closeChannels() {
    this.http.post(`${this.apiUrl}/close`, { status: false }).subscribe();
  }

  getPrices(): Observable<{prices: {amount: number, price: number}[]}> {
    return this.http.get(`${this.apiUrl}/price`).pipe(
      map(response => response as {prices: {amount: number, price: number}[]})
    );
  }

  savePrices(prices: any[]) {
    this.http.post(`${this.apiUrl}/price`, { prices }).subscribe();
  }

  saveMargin(margin: number) {
    this.http.post(`${this.apiUrl}/margin`, { margin }).subscribe();
  }

  loadAnchors(ethId?: string): Observable<Anchor[]> {
    return this.http.get(`${this.apiUrl}/anchor`, ethId ? { params: { ethId } } : {}).pipe(
      map((response: any) => response.anchors as Anchor[]),
    ) as Observable<Anchor[]>;
  }

  checkNotarization(): Observable<any> {
    return this.http.get(`${this.apiUrl}/check`).pipe(
      tap(response => this.dashboardStore.setNotarization(response)),
      take(1),
    );
  }

  getCellInfo(ethId: string): Observable<Cell> {
    return this.http.get(`${this.apiUrl}/getCellInfo`, { params: { ethId }}).pipe(
      map((response: any) => response as Cell),
      tap((cell: Cell) => this.dashboardStore.setCell(cell))
    );
  }

}
