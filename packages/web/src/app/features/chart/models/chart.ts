import { ChartActionType } from './chart-action';
import { ChartPointData } from './chart-data';

export interface ChartValues {
  time: number;
  value: string;
}

export interface ChartDataSet {
  timestamps: number[];
  points: ChartPointData[];
  meta?: ChartDataSetMeta;
}

export interface ChartDataSetMeta {
  actionType: ChartActionType;
  points: ChartPointData[];
  pointIndexes?: number[];
}

export interface ChartSeriesOptions {
  data: any[];
  id: string;
  color: string;
}
