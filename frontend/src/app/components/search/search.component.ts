import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IState } from 'src/app/reducers';
import { searchHikingRouteAction, openSearchFilterAction } from 'src/app/actions';
import { IHikingRouteSearchQuery, SearchFilterT } from '@tb/interfaces';
import { HikingRouteDifficultyToString, TimeSpanUtils } from '@tb/utils';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { DistanceKmPipe } from 'src/app/pipes/distance-km.pipe';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {

  public filters$: Observable<SearchFilterT[]>;

  constructor(
    private store: Store<IState>,
  ) { }

  public ngOnInit(): void {
    this.filters$ = this.store.pipe(select('search'), pluck('filters'));
  }

  public search(): void {
    this.store.dispatch(searchHikingRouteAction());
  }

  public filterValueToString(partialSearchQuery: Partial<IHikingRouteSearchQuery>): string {
    if (partialSearchQuery.atLocation) {
      const distanceKmPipe = new DistanceKmPipe();
      return partialSearchQuery.atLocation.location +
        ', Umkreis: ' + distanceKmPipe.transform(partialSearchQuery.atLocation.distance, 'm');
    }
    if (partialSearchQuery.difficultyFrom !== undefined || partialSearchQuery.difficultyTo !== undefined) {
      return [partialSearchQuery.difficultyFrom, partialSearchQuery.difficultyTo]
        .filter(x => x !== undefined)
        .map(x => HikingRouteDifficultyToString(x))
        .join(' - ');
    }
    if (partialSearchQuery.minDuration || partialSearchQuery.maxDuration) {
      return [partialSearchQuery.minDuration, partialSearchQuery.maxDuration]
        .filter(x => x !== undefined)
        .map(x => TimeSpanUtils.ITimeSpanToString(x))
        .join(' - ');
    }
    return 'nicht gesetzt';
  }

  public edit(filter: SearchFilterT): void {
    this.store.dispatch(openSearchFilterAction({ filter }));
  }

}
