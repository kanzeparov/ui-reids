import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({ name: 'formatDate' })
export class FormatDatePipe implements PipeTransform {
  transform(iso: string, placeholder = 'n/a'): string {
    const parsed = DateTime.fromISO(iso, { setZone: true });
    return parsed.setLocale('ru').toFormat('dd MMM yyyy');
  }
}
