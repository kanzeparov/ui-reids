import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'slice' })
export class SlicePipe implements PipeTransform {
  transform(value: number | string, from: number, to: number, placeholder = 'n/a'): string {
    return value ? value.toString().slice(from, to) : placeholder;
  }
}
