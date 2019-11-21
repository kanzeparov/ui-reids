import { LoadingState } from '@core/models';
import { Price } from '@dashboard/models';

export interface ProductionPeer {
  total: string;
  id: string;
  balance: number;
  sold: number;
  price: number;
}

export interface ProductionEnergy {
  date: string;
  energy: number;
}

export interface ProductionValues {
  minEnergy: number;
  maxEnergy: number;
  averageEnergy: number;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
}

export interface Production {
  30: ProductionValues;
  today: ProductionValues;
  energy_today: ProductionEnergy[];
  energy_30_day: ProductionEnergy[];
  price_today: Price[];
  price_30_day: Price[];
  peers_30_days: ProductionPeer[];
  peers_today: ProductionPeer[];
}

export interface ProductionState {
  loadingState: LoadingState;
  production?: Production;
}
