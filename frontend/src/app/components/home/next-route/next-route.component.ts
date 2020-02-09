import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { IState } from 'src/app/reducers';
import { pluck } from 'rxjs/operators';
import { IHikingRoute } from '@tb/interfaces';
import { loadNextHikeAction, navigateToRouteAction } from 'src/app/actions';

@Component({
    selector: 'app-next-route',
    templateUrl: './next-route.component.html',
    styleUrls: ['./next-route.component.less']
})
export class NextRouteComponent implements OnInit {

    public loading$: Observable<string>;
    public nextHikeRoute$: Observable<IHikingRoute>;

    constructor(
        private store: Store<IState>,
    ) {
        this.loading$ = store.pipe(select('hikingRoute'), pluck('nextRoutePending'));
        this.nextHikeRoute$ = store.pipe(select('hikingRoute'), pluck('nextHikingRoute'));
    }

    public ngOnInit(): void {
        this.store.dispatch(loadNextHikeAction());
        this.nextHikeRoute$ = this.store.pipe(select('hikingRoute'), pluck('nextHikingRoute'));
        this.loading$ = this.store.pipe(select('hikingRoute'), pluck('nextRoutePending'));
    }

    public openRoute(hike: IHikingRoute):void{
        this.store.dispatch(navigateToRouteAction({ route: `/hiking-route/${hike.id}` }));
    }   
}
