import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatPower' })
export class FormatPowerPipe implements PipeTransform {
  cachedValues: { [value: string]: string } = {};

  transform(value: number | string, placeholder = 'n/a'): string {
    if (value === null || value === undefined) {
      return placeholder;
    }

    const [head, tail] = value.toString().split('.');
    if (!this.cachedValues[value]) {
      const formattedHead = head.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      const formattedValue = tail ? `${formattedHead},${tail.slice(0, 2)}` : formattedHead;
      this.cachedValues[value] = formattedValue;
    }

    return this.cachedValues[value];
  }
}
