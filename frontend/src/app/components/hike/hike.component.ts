import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IHikingRoute } from '@tb/interfaces';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { IState } from 'src/app/reducers';
import { loadHikingRouteAction, navigateToRouteAction } from 'src/app/actions';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-hike',
  templateUrl: './hike.component.html',
  styleUrls: ['./hike.component.less']
})
export class HikeComponent implements OnInit {

  public loading$: Observable<string>;
  public hikingRoute$: Observable<IHikingRoute>;

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
  }

  public openDetails(hike: IHikingRoute): void {
    this.store.dispatch(navigateToRouteAction({ route: `/hiking-route-details/${hike.id}` }));
  }
}
