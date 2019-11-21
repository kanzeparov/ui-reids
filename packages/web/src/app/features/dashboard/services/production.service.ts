import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { Production } from '@dashboard/models';
import { ProductionStore } from '@core/store';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { environment } from '@env';

@Injectable()
export class ProductionService {

  constructor(
    private http: HttpClient,
    private productionStore: ProductionStore,
  ) { }

  protected productionApiUrl = `${environment.backendUrl}/api/production`;

  fetchProduction(ethId: string | undefined): Observable<Production> {
    return timer(0, 15 * 60 * 1000).pipe(
      switchMap(() => {
        return this.http.get(this.productionApiUrl, ethId ? { params: { ethId } } : {}).pipe(
          catchError(() => {
            return of(undefined);
          })
        ) as Observable<Production>;
      }),
      tap((production: Production) => this.productionStore.setProduction(production)),
    );
  }

}
