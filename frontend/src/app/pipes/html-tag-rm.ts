import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hmtlRm'
})

export class HtmlTagRm implements PipeTransform {

  public transform(value: string): string {
    const re = /<[^>]*>/g;
    var transformed = value.replace(re, '');
    return transformed;
  }
}
