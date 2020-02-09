import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { loadHikingRouteAction, navigateToRouteAction } from 'src/app/actions';
import { pluck, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IHikingRoute } from '@tb/interfaces';
import { HikingRouteDifficultyToString } from '@tb/utils';

@Component({
  selector: 'app-hiking-route',
  templateUrl: './hiking-route.component.html',
  styleUrls: ['./hiking-route.component.less']
})
export class HikingRouteComponent implements OnInit {

  public loading$: Observable<string>;
  public hikingRoute$: Observable<IHikingRoute>;
  public hikeDifficulty$: Observable<string>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<IState>,
  ) { }

  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.store.dispatch(loadHikingRouteAction({ id: paramMap.get('id') }));
    });
    this.hikingRoute$ = this.store.pipe(select('hikingRoute'), pluck('hikingRoute'));
    this.loading$ = this.store.pipe(select('hikingRoute'), pluck('hikingRouteLoadPending'));
    this.hikeDifficulty$ = this.hikingRoute$.pipe(map(hike => {
      return HikingRouteDifficultyToString(hike.rating.difficulty);
    }));
  }

  public openDetails(hike: IHikingRoute): void {
    this.store.dispatch(navigateToRouteAction({ route: `/hiking-route-details/${hike.id}` }));
  }
}
