import { action, Store, StoreConfig } from '@datorama/akita';
import { LoadingState } from '@core/models';
import { TransactionState, Transaction, TransactionResponse } from '@dashboard/models';

const INITIAL_STATE: TransactionState = {
  loadingState: LoadingState.EMPTY,
  transactions: {} as TransactionResponse,
};

@StoreConfig({
  name: 'transactions',
  resettable: true,
})
export class TransactionStore extends Store<TransactionState> {
  constructor() {
    super(INITIAL_STATE);
  }

  setLoading() {
    this.update({ loadingState: LoadingState.LOADING });
  }

  @action('Set transactions')
  setTransactions(transactions: TransactionResponse) {
    const updates = {
      transactions,
      loadingState: LoadingState.LOADED,
    };
    this.update(updates);
  }

}
