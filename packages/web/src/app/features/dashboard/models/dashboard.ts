import { Cell } from './cell';

export enum NavigationTabs {
  monitoring = 'monitoring',
  transactions = 'transactions',
}

export enum DateRange {
  month = '30',
  today = 'today',
}

export interface DashboardState {
  dateRange: string;
  activeTab: string;
  isEnergyStorageActive: boolean;
  activeEthId?: string;
  cell?: Cell;
  notarization?: any;
}
