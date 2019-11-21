import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { Consumption } from '@dashboard/models';
import { ConsumptionStore } from '@core/store';
import { tap, switchMap, catchError, mergeMap, concatMap, map } from 'rxjs/operators';
import { environment } from '@env';

@Injectable()
export class ConsumptionService {

  constructor(
    private http: HttpClient,
    private consumptionStore: ConsumptionStore,
  ) { }

  protected consumptionApiUrl = `${environment.backendUrl}/api/consumption`;

  fetchConsumption(ethId?: string | undefined) {
    return timer(0, 15 * 60 * 1000).pipe(
      switchMap(() => {
        return this.http.get(this.consumptionApiUrl, ethId ? { params: { ethId } } : {}).pipe(
          catchError(() => {
            return of(undefined);
          })
        ) as Observable<Consumption>;
      }),
      tap((consumption: Consumption) => this.consumptionStore.setConsumption(consumption))
    );
  }
}
