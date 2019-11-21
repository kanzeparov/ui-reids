import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'toFixed' })
export class ToFixedPipe implements PipeTransform {
  transform(value: number | string, digits: number = 2, separator: string = '.', placeholder = 'n/a'): string {
    if (!value) {
      return placeholder;
    }

    return Number(value).toFixed(digits).replace('.', separator);
  }
}
