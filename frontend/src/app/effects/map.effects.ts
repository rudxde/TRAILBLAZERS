import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { beginTrackAction, newPositionAction, setChunksAction, setDebugDataAction, setSpeedAction, endTrackAction } from '../actions/map.actions';
import { combineLatest, interval, EMPTY } from 'rxjs';
import {
    map,
    distinctUntilChanged,
    switchMap,
    auditTime,
    exhaustMap,
    scan,
    throttleTime,
    pairwise,
    withLatestFrom,
    takeUntil,
    reduce,
    tap,
    catchError,
} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { IState } from '../reducers';
import { MapService } from '../services/map/map.service';
import { getChunk } from '../lib/chunk';
import { pixelToCoords } from '../lib/coord-pixel';
import { PositionService } from '../services/position/position.service';
import { Maps } from '@tb/interfaces';
import { IHikeReport, ITimeSpan } from '@tb/interfaces';
import { differenceInSeconds } from 'date-fns';
import { rateHikeAction, setHikeReport } from '../actions';
import { ProfileService } from '../services/profile/profile.service';
import { Haversine, TimeSpanUtils } from '@tb/utils';

const CHUNK_DECIMAL_SCALE = Math.pow(10, 3);

interface ICollectHikeData {
    actualState: Maps.ISpeedDataState;
    pauses: { start: Date, end?: Date, position: Maps.ICoords }[];
    speedRatings: {
        walking: number,
        slow: number,
        running: number,
        driving: number,
        all: number
    };
    speedReduction: {
        walking: number,
        slow: number,
        running: number,
        driving: number,
        all: number,
        divisor: number,
    };
}

@Injectable()
export class MapEffects {

    public beginTrack = createEffect(() => this.actions$.pipe(
        ofType(beginTrackAction),
        switchMap(() => this.positionService.getInterpolatedLocation$()
            .pipe(
                takeUntil(this.actions$
                    .pipe(
                        ofType(endTrackAction),
                    ),
                ),
            ),
        ),
        map(x => newPositionAction(x)),
    ));

    public loadChunks = createEffect(() =>
        this.actions$.pipe(
            ofType(beginTrackAction),
            switchMap(
                () =>
                    combineLatest(
                        this.actions$.pipe(ofType(newPositionAction)),
                        this.store.pipe(select('map'))
                    ).pipe(
                        auditTime(1500),
                        distinctUntilChanged(),
                        exhaustMap(([position, mapState]) => {
                            const viewport = mapState.viewport;
                            const extraWidth = viewport.width;
                            const extraHeight = viewport.height;
                            const viewportCenterOffset = { x: viewport.width / 2, y: viewport.height / 2 };
                            const fromCoords = pixelToCoords(position, { x: - extraWidth, y: -extraHeight }, viewportCenterOffset, viewport.scale);
                            const loadToPoint = { x: viewport.width + extraWidth, y: viewport.height + extraHeight };
                            const toCoords = pixelToCoords(position, loadToPoint, viewportCenterOffset, viewport.scale);
                            const chunkIds: string[] = [];
                            for (let lon = fromCoords.lon; lon <= toCoords.lon; lon += 1 / CHUNK_DECIMAL_SCALE) {
                                for (let lat = toCoords.lat; lat <= fromCoords.lat; lat += 1 / CHUNK_DECIMAL_SCALE) {
                                    chunkIds.push(getChunk({ lat, lon }));
                                }
                            }
                            const reuseableChunks = mapState.loadedChunks.filter(chunk => chunkIds.find(x => chunk.id === x));
                            const missingChunkIds = chunkIds.filter(id => !mapState.loadedChunks.find(loadedChunk => loadedChunk.id === id));
                            console.info('chunks:', chunkIds.length, 'reuse:', reuseableChunks.length, 'load:', missingChunkIds.length);
                            return this.mapService.loadChunks(missingChunkIds).pipe(scan((acc, val) => [...val, ...acc], reuseableChunks));
                        }),
                        map(chunks => setChunksAction({ chunks })),
                        takeUntil(this.actions$.pipe(
                            ofType(endTrackAction)
                        )),
                    ),
            ),
        ),
    );

    public getSpeed$ = createEffect(() => this.actions$.pipe(
        ofType(beginTrackAction),
        switchMap(() => this.positionService.getSpeed$()
            .pipe(
                catchError(err => // Fallback, if speed is not provided
                   { 
                       console.error(err, 'Fallback: using coordinates to calculate speed.');
                       return interval(1000)
                        .pipe(
                            withLatestFrom(this.store.pipe(select('map', 'position'))),
                            map(([_, coords]) => coords),
                            pairwise(),
                            map(([a, b]) => Math.round(Haversine.haversineMeasure(a, b) * 36) / 10),
                            distinctUntilChanged(),
                        );
                    }
                ),
                map(x => setSpeedAction({ speed: x })),
                takeUntil(this.actions$
                    .pipe(
                        ofType(endTrackAction),
                    ),
                ),
            ),
        ),
    ));

    public setDebugData = createEffect(() =>
        this.store.pipe(
            select('map'),
            throttleTime(2000),
            map(mapState => {
                return setDebugDataAction({
                    data: '' +
                        `lat : ${mapState.position.lat}°\n` +
                        `lon : ${mapState.position.lon}°\n` +
                        `scale : ${mapState.viewport.scale}\n` +
                        `speed : ${mapState.speed} km/h\n` +
                        `height : ${mapState.viewport.height}px\n` +
                        `width : ${mapState.viewport.width}px\n` +
                        '',
                });
            }),
        ));

    public collectHikeData = createEffect(() => this.actions$.pipe(
        ofType(beginTrackAction),
        exhaustMap(x =>
            combineLatest(
                this.store.pipe(select('map', 'speed')),
                this.store.pipe(select('map', 'speedRating')),
            ).pipe(
                takeUntil(this.actions$.pipe(ofType(endTrackAction))),
                withLatestFrom(this.store.pipe(select('map', 'position'))),
                reduce<[[number, Maps.ISpeedDataState], Maps.ICoords], ICollectHikeData>(
                    (acc, [[speed, speedRating], position]) => {
                        const result = {
                            ...acc,
                            speedRating: { ...acc.speedRatings },
                            speedReduction: { ...acc.speedReduction },
                        };
                        if (speedRating === 'pause') {
                            if (acc.actualState !== 'pause') {
                                result.pauses = [
                                    { position, start: new Date() },
                                    ...acc.pauses,
                                ];
                            }
                        } else {
                            if (acc.actualState === 'pause') {
                                result.pauses[0].end = new Date();
                            } else {
                                switch (speedRating) {
                                    case 'driving':
                                        result.speedRatings.driving++;
                                        result.speedReduction.driving += speed;
                                        break;
                                    case 'running':
                                        result.speedRatings.running++;
                                        result.speedReduction.running += speed;
                                        break;
                                    case 'walking':
                                        result.speedRatings.walking++;
                                        result.speedReduction.walking += speed;
                                        break;
                                    case 'slow':
                                        result.speedRatings.slow++;
                                        result.speedReduction.slow += speed;
                                        break;
                                }
                                result.speedRatings.all++;
                                result.speedReduction.all += speed;
                            }
                        }
                        result.actualState = speedRating;
                        return result;
                    },
                    <ICollectHikeData>{
                        actualState: 'initial',
                        pauses: [],
                        speedRatings: {
                            all: 0,
                            driving: 0,
                            running: 0,
                            slow: 0,
                            walking: 0
                        },
                        speedReduction: {
                            driving: 0,
                            running: 0,
                            slow: 0,
                            all: 0,
                            walking: 0
                        }
                    }
                ),
                map((reducedHike): IHikeReport => {
                    const speed = {
                        all: reducedHike.speedReduction.all / reducedHike.speedRatings.all,
                        driving: reducedHike.speedReduction.driving / reducedHike.speedRatings.driving,
                        running: reducedHike.speedReduction.running / reducedHike.speedRatings.running,
                        slow: reducedHike.speedReduction.slow / reducedHike.speedRatings.slow,
                        walking: reducedHike.speedReduction.walking / reducedHike.speedRatings.walking,
                    };
                    const pauses = reducedHike.pauses.map(pause => {
                        const result = { ...pause, end: pause.end ? pause.end : new Date(), duration: <ITimeSpan>{} };
                        const duration = differenceInSeconds(result.end, result.start);
                        result.duration = TimeSpanUtils.SecondsToTimeSpan(duration);
                        return result;
                    });
                    return {
                        speed,
                        pauses,
                        rating: 0,
                        speedRatings: reducedHike.speedRatings,
                    };
                }),
                tap(console.log),

            ),
        ),
        map((x: IHikeReport) => setHikeReport({ report: x })),
    ));

    public submitHikeReport = createEffect(() => this.actions$.pipe(
        ofType(rateHikeAction),
        withLatestFrom(this.store.pipe(select('hikingRoute', 'hikeReport'))),
        map(([{ rating }, report]) => ({
            ...report,
            rating: rating,
        })),
        exhaustMap((report: IHikeReport) => this.profileService.submitHikeReport$(report)),
        switchMap(() => EMPTY),
    ));

    constructor(
        private actions$: Actions,
        private store: Store<IState>,
        private mapService: MapService,
        private positionService: PositionService,
        private profileService: ProfileService,
    ) { }

}
