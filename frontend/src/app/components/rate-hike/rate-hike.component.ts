import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IState } from 'src/app/reducers';
import { rateHikeAction } from 'src/app/actions';
import { Observable } from 'rxjs';
import { ITimeSpan } from '@tb/interfaces';
import { TimeSpanUtils } from '@tb/utils';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-rate-hike',
  templateUrl: './rate-hike.component.html',
  styleUrls: ['./rate-hike.component.less']
})
export class RateHikeComponent implements OnInit {

  public ratings = [1, 2, 3, 4, 5];

  public averageSpeed$: Observable<number>;
  public ratingParts$: Observable<{ name: string, value: number }[]>;
  public pauseTimeSpan$: Observable<ITimeSpan>;

  constructor(
    public store: Store<IState>,
  ) { }

  public ngOnInit(): void {
    this.pauseTimeSpan$ = this.store.pipe(
      select('hikingRoute', 'hikeReport', 'pauses'),
      map(pauses => pauses.map(x => x.duration).reduce(TimeSpanUtils.AddTimeSpans, {})),
    );
    this.averageSpeed$ = this.store.pipe(
      select('hikingRoute', 'hikeReport', 'speed', 'all'),
      map(x => Math.round(x)),
    );
    this.ratingParts$ = this.store.pipe(
      select('hikingRoute', 'hikeReport', 'speedRatings'),
      map(x => [
        { name: 'Gefahren', value: Math.round(x.driving / x.all * 100) },
        { name: 'Gerannt', value: Math.round(x.running / x.all * 100) },
        { name: 'Gelaufen', value: Math.round(x.walking / x.all * 100) },
        { name: 'Langsam', value: Math.round(x.slow / x.all * 100) },
      ])
    );

  }

  public rate(rating: number): void {
    this.store.dispatch(rateHikeAction({ rating: rating }));
  }

}
