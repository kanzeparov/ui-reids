import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'formatHash'})
export class FormatHashPipe implements PipeTransform {

  transform(value: string): string {
    const splittedHash = value.split(/(^\w{5}).*(\w{5}$)/im);
    return `${splittedHash[1]}*****${splittedHash[2]}`;
  }

}
