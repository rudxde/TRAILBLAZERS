import { Injectable } from '@angular/core';
import { PositionService } from './position.service';
import { Observable } from 'rxjs';
import { Maps } from '@tb/interfaces';
import { environment } from '@tb/environment/dist/prod';
import { testTour } from './test-tour';
import { map } from 'rxjs/operators';
import { Haversine } from '@tb/utils';

@Injectable({
  providedIn: 'root'
})
export class PositionMockService extends PositionService {

  protected getGeoLocationObservable(): Observable<Position> {
    return (
      environment.map.useGpsMock === 'tour'
        ? this.getTourPosition()
        : this.getStaticPosition()
    )
      .pipe(map(x => <Position>({
        coords: {
          latitude: x.lat,
          longitude: x.lon,
          accuracy: null,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: (new Date()).getTime(),
      })));
  }

  private getTourPosition(): Observable<Maps.ICoords> {
    const coords: Maps.ICoords[] = testTour.split(' ').map(x => {
      const [lon, lat, _] = x.split(',');
      return ({ lat: parseFloat(lat), lon: parseFloat(lon) });
    });
    const distances = coords.map((value, index, array) => {
      return Haversine.haversineMeasure(value, array[(index + 1) % array.length]);
    }).filter(Boolean);

    return new Observable<Maps.ICoords>(observer => {
      function nextPosition(index: number): void {
        if (index >= coords.length) {
          index = 0;
        }
        setTimeout(() => {
          observer.next(coords[index]);
          nextPosition(index + 1);
        }, distances[(index + 1) % distances.length] * 100);
      }
      nextPosition(0);
    });
  }

  private getStaticPosition(): Observable<Maps.ICoords> {
    return new Observable<Maps.ICoords>(observer => {
      if (!environment.map.useGpsMock || environment.map.useGpsMock === 'tour') {
        observer.error(new Error('environment changed'));
        return;
      }
      observer.next(environment.map.useGpsMock);
    });
  }

}
