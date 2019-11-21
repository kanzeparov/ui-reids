import { Pipe, PipeTransform } from '@angular/core';

declare type Position = 'start' | 'end' | 'none';

@Pipe({ name: 'formatPercentage' })
export class FormatPercentagePipe implements PipeTransform {
  cachedValues: { [value: number]: string } = {};

  transform(value: number | string, percentagePosition: Position = 'end', placeholder = 'n/a'): string {
    if (value === null || value === undefined) {
      return placeholder;
    }

    const valueAsNumber = Number(value);
    if (isNaN(valueAsNumber)) {
      return placeholder;
    }

    if (!this.cachedValues[valueAsNumber]) {
      this.cachedValues[valueAsNumber] = this.formatValue(valueAsNumber, percentagePosition);
    }

    return this.cachedValues[valueAsNumber];
  }

  formatValue(value: number, percentagePosition: Position) {
    switch (percentagePosition) {
      case 'start': return '%' + value.toFixed(2);
      case 'end': return value.toFixed(2) + '%';

      case 'none':
      default:
        return value.toFixed(2);
    }
  }
}
