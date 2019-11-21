import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({ name: 'formatDatetime' })
export class FormatDatetimePipe implements PipeTransform {
  transform(isoString: string, placeholder = 'n/a'): string {
    const parsed = DateTime.fromISO(isoString, { setZone: true });
    return parsed.setLocale('ru').toFormat('dd MMM yyyy, HH:mm');
  }
}
