import { LoadingState } from '@core/models';
import { Energy, Price } from '@dashboard/models';

export interface ConsumptionPeer {
  total: string;
  id: string;
  balance: number;
  bought: number;
  price: number;
}

export interface ConsumptionValues {
  minEnergy: number;
  maxEnergy: number;
  averageEnergy: number;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
}

export interface Consumption {
  30: ConsumptionValues;
  today: ConsumptionValues;
  energy_today: Energy[];
  energy_30_day: Energy[];
  price_today: Price[];
  price_30_day: Price[];
  peers_30_days: ConsumptionPeer[];
  peers_today: ConsumptionPeer[];
}

export interface ConsumptionState {
  loadingState: LoadingState;
  consumption?: Consumption;
}
