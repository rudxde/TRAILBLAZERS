import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { interpolateObservable } from 'src/app/lib/interpolate-observable';
import { delay, distinctUntilChanged, map, share } from 'rxjs/operators';
import { Maps } from '@tb/interfaces';

@Injectable({
    providedIn: 'root'
})
export class PositionService {

    /**
     * Interpolates the values of the geolocation.
     *
     * @returns {Observable<Maps.ICoords>}
     * @memberof PositionService
     */
    public getInterpolatedLocation$(): Observable<Maps.ICoords> {
        const geoLocationObservable = this.getGeoLocationObservable();
        return combineLatest([
            interpolateObservable(undefined, geoLocationObservable.pipe(map(x => x.coords.latitude), delay(0))),
            interpolateObservable(undefined, geoLocationObservable.pipe(map(x => x.coords.longitude), delay(0))),
        ]).pipe(
            distinctUntilChanged(),
            map(([lat, lon]) => (<Maps.ICoords>{ lat, lon })),
        );
    }

    public getSpeed$(): Observable<number> {
        const geoLocationObservable = this.getGeoLocationObservable();
        return interpolateObservable(undefined, geoLocationObservable
            .pipe(
                map(x => {
                    if (!x.coords.speed) throw new Error('speed not provided');
                    return x.coords.speed;
                }),
                delay(0),
            ));
    }

    /**
     * Wraps the ```navigator.geolocation.watchPosition```-api stream in an observable.
     *
     * @returns {Observable<Maps.ICoords>}
     * @memberof PositionService
     */
    protected getGeoLocationObservable(): Observable<Position> {
        return new Observable<Position>(observer => {
            if (!navigator.geolocation) {
                observer.error(new Error(`no GPS services present!`));
                return;
            }
            let watch = navigator.geolocation.watchPosition(
                position => {
                    observer.next(position);
                },
                err => {
                    observer.error(err);
                }
            );
            return () => navigator.geolocation.clearWatch(watch);
        }).pipe(
            share(),
        );
    }
}
