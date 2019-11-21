import { Injectable } from '@angular/core';
import { tap, switchMap, map } from 'rxjs/operators';
import { Transaction, TransactionResponse } from '@dashboard/models';
import { Observable, timer } from 'rxjs';
import { TransactionStore } from '@core/store';
import { environment } from '@env';
import { HttpClient } from '@angular/common/http';
interface Report {
  report: string;
}
@Injectable()
export class TransactionService {

  constructor(
    private http: HttpClient,
    private transactionStore: TransactionStore,
  ) { }

  protected transactionApiUrl = `${environment.backendUrl}/api`;

  fetchTransactions(ethId?: string): Observable<TransactionResponse> {
    return timer(0, 15 * 60 * 1000).pipe(
      switchMap(() => {
        return this.http.get(`${this.transactionApiUrl}/transaction`, ethId ? { params: { ethId } } : {}) as Observable<TransactionResponse>;
      }),
      tap((transactions: TransactionResponse) => this.transactionStore.setTransactions(transactions)),
    );
  }

  downloadTransactionsExcel() {
    return this.http.get(`${this.transactionApiUrl}/excel/transaction`).pipe(map(response => response as Report));
  }

}
