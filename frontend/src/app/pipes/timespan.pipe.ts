import { Pipe, PipeTransform } from '@angular/core';
import { ITimeSpan } from '@tb/interfaces';
import { TimeSpanUtils } from '@tb/utils';

@Pipe({
  name: 'timespan'
})
export class TimespanPipe implements PipeTransform {

  /**
   * Converts an TimeSpan into an string.
   *
   * @param {ITimeSpan} value
   * @param {...any[]} args
   * @returns {string}
   * @memberof TimespanPipe
   */
  public transform(value: ITimeSpan, ...args: any[]): string {
    return TimeSpanUtils.ITimeSpanToString(value);
  }
}
