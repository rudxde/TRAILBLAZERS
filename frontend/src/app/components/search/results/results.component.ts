import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IHikingRoute } from '@tb/interfaces';
import { Store, select } from '@ngrx/store';
import { IState } from 'src/app/reducers';
import { pluck, filter, takeUntil, take } from 'rxjs/operators';
import { noSearchResultsHikingRouteAction, navigateToRouteAction } from 'src/app/actions';

@Component({
  selector: 'app-search-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.less']
})
export class SearchResultsComponent implements OnInit, OnDestroy {

  public destroy$: Subject<void>;
  public loading$: Observable<'loading' | 'loaded' | 'initial'>;
  public results$: Observable<IHikingRoute[]>;

  constructor(
    private store: Store<IState>,
  ) {
    this.destroy$ = new Subject<void>();
    this.loading$ = store.pipe(select('hikingRoute'), pluck('hikingRouteSearchResultsPending'));
    this.results$ = store.pipe(select('hikingRoute'), pluck('hikingRouteSearchResults'));
  }

  public ngOnInit(): void {
    this.loading$.pipe(
      takeUntil(this.destroy$),
      take(1),
      filter(loading => loading === 'initial'),
    ).subscribe(
      () => this.store.dispatch(noSearchResultsHikingRouteAction())
    );

  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }

  public openRoute(r: IHikingRoute): void {
    this.store.dispatch(navigateToRouteAction({ route: `/hiking-route/${r.id}` }));
  }

}
