import { Injectable } from '@angular/core';

import { isOversized, sliceData } from '@utils/array.util';
import { unixInMs } from '@utils/datetime.util';
import { toSafeNumber } from '@utils/number.util';

import { ChartActionType } from '@chart/models/chart-action';
import { ChartPointData } from '@chart/models/chart-data';
import { ChartValues, ChartDataSet, ChartDataSetMeta } from '@chart/models/chart';

import { CHART_POINTS_LIMIT } from '@chart/chart.constant';

@Injectable()
export class ChartDataService {
  BLANK_ACC = {
    timestamps: [],
    points: [],
  };

  constructor() { }

  public buildAcc = (items: ChartValues[]) => {
    const accumulation = this.buildNormalizedAcc(items);

    return {
      ...accumulation,
      meta: {
        actionType: ChartActionType.SetSeries,
        points: accumulation.points,
      },
    };
  }

  public updateAcc = (prevAcc: ChartDataSet, item: ChartValues) => {
    const point = this.buildPoint(item);
    const action = this.findActionType(prevAcc.timestamps, point);

    switch (action) {
      case ChartActionType.UpdatePoints:
        return this.updateAccPoints(prevAcc, point, action);
      case ChartActionType.AddPoints:
        return this.addAccPoint(prevAcc, point, action);
      case ChartActionType.AddPointsWithShift:
        return this.addAccPointWithShift(prevAcc, point, action);
      default:
        return this.setAccSeries();
    }
  }

  private setAccSeries() {

  }

  private updateAccPoints(prevAcc: ChartDataSet, point: ChartPointData, actionType: ChartActionType) {
    const timestamp = this.pointTimestamp(point);
    const pointIndex = prevAcc.timestamps.indexOf(timestamp);
    const points = prevAcc.points.map((prevPoint: ChartPointData, index: number) => {
      if (index !== pointIndex) {
        return prevPoint;
      }

      return point;
    });

    return {
      ...prevAcc,
      points,
      meta: { actionType, points: [ point ], pointIndexes: [ pointIndex ] },
    };
  }

  private addAccPoint(prevAcc: ChartDataSet, point: ChartPointData, actionType: ChartActionType) {
    const timestamp = this.pointTimestamp(point);
    const points = [ ...prevAcc.points, point ];
    const timestamps = [ ...prevAcc.timestamps, timestamp ];

    return {
      ...prevAcc,
      points,
      timestamps,
      meta: { actionType, points: [ point ] },
    };
  }

  private addAccPointWithShift(prevAcc: ChartDataSet, point: ChartPointData, actionType: ChartActionType) {
    const timestamp = this.pointTimestamp(point);
    const points = [ ...sliceData(prevAcc.points, CHART_POINTS_LIMIT, 1), point ];
    const timestamps = [ ...sliceData(prevAcc.timestamps, CHART_POINTS_LIMIT, 1), timestamp ];

    return {
      ...prevAcc,
      points,
      timestamps,
      meta: { actionType, points: [ point ] },
    };
  }

  public buildChartAction(seriesId: string, meta: ChartDataSetMeta) {
    return {
      type: meta.actionType,
      payload: {
        seriesDataList: [
          { id: seriesId, points: meta.points, pointIndexes: meta.pointIndexes }
        ]
      },
    };
  }

  /* Helpers */

  private findActionType(timestamps: number[], point: ChartPointData) {
    const timestamp = this.pointTimestamp(point);

    if (timestamps.includes(timestamp)) {
      return ChartActionType.UpdatePoints;
    }

    if (!isOversized(timestamps, CHART_POINTS_LIMIT, 1)) {
      return ChartActionType.AddPoints;
    }

    return ChartActionType.AddPointsWithShift;
  }

  private buildNormalizedAcc(rawItems: ChartValues[]) {
    const items = isOversized(rawItems, CHART_POINTS_LIMIT) ?
      sliceData(rawItems, CHART_POINTS_LIMIT) :
      rawItems;

    return items
      .sort(this.sortByTimestamp)
      .reduce(this.accumulateTimestampsAndPoints, this.BLANK_ACC);
  }

  private accumulateTimestampsAndPoints = (memo: ChartDataSet, item: ChartValues) => {
    const point = this.buildPoint(item);
    const timestamp = this.pointTimestamp(point);

    return {
      timestamps: [ ...memo.timestamps, timestamp ],
      points: [ ...memo.points, point ],
    };
  }

  private buildPoint(item: ChartValues) {
    return {
      y: toSafeNumber(item.value),
      x: unixInMs(item.time),
    };
  }

  private sortByTimestamp(a: ChartValues, b: ChartValues) {
    if (a.time === b.time) {
      return 0;
    }

    return a.time > b.time ? 1 : -1;
  }

  private pointTimestamp(point: ChartPointData) {
    return point.x;
  }
}
