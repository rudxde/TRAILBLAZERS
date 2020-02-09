import { Component, OnInit, OnDestroy } from '@angular/core';
import { loadHikingRouteAction, navigateToRouteAction } from 'src/app/actions';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, from } from 'rxjs';
import { IHikingRoute } from '@tb/interfaces';
import { Store, select } from '@ngrx/store';
import { IState } from 'src/app/reducers';
import { pluck, map, takeUntil, filter } from 'rxjs/operators';
import { HtmlTagRm } from '../../pipes/html-tag-rm';

@Component({
    selector: 'app-hiking-route-details',
    templateUrl: './hiking-route-details.component.html',
    styleUrls: ['./hiking-route-details.component.less']
})
export class HikingRouteDetailsComponent implements OnInit, OnDestroy {

    public loading$: Observable<string>;
    public hikingRoute$: Observable<IHikingRoute>;
    public openMapsURL$: Observable<string>;
    public dontForget = [];
    public dontForgetItem: string;
    private destroy$: Subject<void> = new Subject();

    constructor(
        private activatedRoute: ActivatedRoute,
        private store: Store<IState>,
    ) { }

    public ngOnInit(): void {
        this.activatedRoute.paramMap
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: paramMap => this.store.dispatch(loadHikingRouteAction({ id: paramMap.get('id') })),
            });
        this.hikingRoute$ = this.store.pipe(select('hikingRoute'), pluck('hikingRoute'));
        this.openMapsURL$ = this.hikingRoute$.pipe(
            map(hike => `https://www.google.com/maps/dir/?api=1&destination=${hike.startingPoint.lat},${hike.startingPoint.lon}`),
        );
        this.loading$ = this.store.pipe(select('hikingRoute'), pluck('hikingRouteLoadPending'));

        this.hikingRoute$
            .pipe(
                takeUntil(this.destroy$),
                filter(x => Boolean(x))
            )
            .subscribe({
                next: route => this.splitItems(route.equipment).forEach(item => this.dontForget.push(item)),
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public addItem(): void {
        this.dontForget.push(this.dontForgetItem);
        this.dontForgetItem = '';
    }

    public startHike(): void {
        this.store.dispatch(navigateToRouteAction({ route: `/navigation` }));
    }

    public splitItems(itemList: string): string[] {
        const htmlRm = new HtmlTagRm();
        return itemList.split(/\,|\;|\./g).map(x => htmlRm.transform(x).trim()).filter(x => Boolean(x));
    }
}
