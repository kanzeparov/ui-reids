import { LoadingState } from '@core/models';

export interface Transaction {
  time: string;
  from: string;
  to: string;
  price: number;
  transfer_energy: number;
  transfer_coin: number;
  balance: number;
}

export interface TransactionResponse {
  transaction_today: Transaction[];
  transaction_30_days: Transaction[];
}

export interface TransactionState {
  loadingState: LoadingState;
  transactions: TransactionResponse;
}
