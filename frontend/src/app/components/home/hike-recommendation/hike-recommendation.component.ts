import { Component, OnInit } from '@angular/core';
import { IHikingRoute } from '@tb/interfaces';
import { Observable } from 'rxjs';
import { IState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { pluck } from 'rxjs/operators';
import { loadHikingRouteRecomendationsAction, navigateToRouteAction } from 'src/app/actions';

@Component({
    selector: 'app-hike-recommendation',
    templateUrl: './hike-recommendation.component.html',
    styleUrls: ['./hike-recommendation.component.less']
})
export class HikeRecommendationComponent implements OnInit {

    public loading$: Observable<boolean>;
    public recommendetHikes$: Observable<IHikingRoute[]>;

    constructor(
        private store: Store<IState>,
    ) {
        this.loading$ = store.pipe(select('hikingRoute'), pluck('hikingRouteRecomendationsPending'));
        this.recommendetHikes$ = store.pipe(select('hikingRoute'), pluck('hikingRouteRecomendations'));
    }

    public ngOnInit(): void {
        this.store.dispatch(loadHikingRouteRecomendationsAction());
    }

    public openRoute(r: IHikingRoute): void {
        this.store.dispatch(navigateToRouteAction({ route: `/hiking-route/${r.id}` }));
    }

}
