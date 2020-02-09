import { Observable } from 'rxjs';
import { HermiteInterpolation } from './hermite-interpolation';

/**
 * Interpolates all values of an observable with a hermiteInterpolation.
 *
 * @export
 * @param {(number | undefined)} start The start-value to interpolate from. If undefined, the first emitted value will be used as start value
 * @param {Observable<number>} source The source observable.
 * @param {number} [duration=1000] The duration, which the Interpolation should take.
 * @param {number} [steps=50] How many steps should be done in the duration interval.
 * @param {number} [fromDerivate=0] Which derivate the interpolation should have for each start.
 * @param {number} [toDerivate=0] With which derivate each interpolation should end.
 * @returns {Observable<number>}
 */
export function interpolateObservable(
    start: number | undefined,
    source: Observable<number>,
    duration: number = 1000,
    steps: number = 50,
    fromDerivate: number = 0,
    toDerivate: number = 0
): Observable<number> {
    return new Observable(observer => {
        let lastValue = start;
        let lastDerivate = fromDerivate;
        let index = steps + 1;
        let interPolation = new HermiteInterpolation();
        const interval = setInterval(
            () => {
                if (index <= steps) {
                    lastValue = interPolation.eval(index);
                    lastDerivate = interPolation.evalDerivate(index);
                    index++;
                    observer.next(lastValue);
                }
            },
            duration / steps,
        );
        function closeSubscription(): void {
            clearInterval(interval);
            // Help GC to prevent Mem-leaks
            lastValue = null;
            lastDerivate = null;
            index = null;
            interPolation = null;
        }
        source.subscribe({
            complete: () => {
                closeSubscription();
                observer.complete();
            },
            error: err => {
                closeSubscription();
                observer.error(err);
            },
            next: value => {
                if(lastValue === undefined) {
                    lastValue = value;
                    observer.next(value);
                    return;
                }
                if (index > steps) {
                    lastDerivate = fromDerivate;
                }
                interPolation = new HermiteInterpolation(0, steps, lastValue, value, lastDerivate, toDerivate);
                index = 1;
            },
        });
    });
}
