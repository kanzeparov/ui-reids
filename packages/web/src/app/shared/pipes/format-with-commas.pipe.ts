import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatWithCommas' })
export class FormatWithCommasPipe implements PipeTransform {
  cachedValues: { [value: string]: string } = {};

  transform(value: number | string, placeholder = 'n/a'): string {
    if (value === null || value === undefined) {
      return placeholder;
    }

    const valueAsString = value.toString().split('.')[0];
    if (!this.cachedValues[valueAsString]) {
      this.cachedValues[valueAsString] = valueAsString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return this.cachedValues[valueAsString];
  }
}
