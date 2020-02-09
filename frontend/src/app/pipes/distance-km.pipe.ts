import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distanceKm'
})
export class DistanceKmPipe implements PipeTransform {

  /**
   * convert's a number of meters into an distance string. e.g. 1100  -> '1km 1m'
   *
   * @param {number} value distance in Meters
   * @param {'km' | 'm' | undefined} roundTo if the result should be rounded to km or m.
   * @param {...any[]} args will be ignored
   * @returns {string}
   * @memberof DistanceKmPipe
   */
  public transform(value: number, roundTo?: 'km' | 'm', ...args: any[]): string {
    const result = [];
    result.push(((value - (value % 1000)) / 1000) + 'km');
    if (roundTo === 'm') {
      result.push(Math.round(value % 1000) + 'm');
    } else if (roundTo === undefined) {
      result.push((value % 1000) + 'm');
    }
    return (roundTo ? '~' : '') + result.join(' ');
  }

}
