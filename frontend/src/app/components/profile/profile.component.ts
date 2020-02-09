import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { IState } from 'src/app/reducers';
import { loadProfileAction } from 'src/app/actions';
import { IUserProfile } from '@tb/interfaces';
import { pluck, takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit, OnDestroy {

  public destroy$: Subject<void>;

  public loading$: Observable<string>;
  public profile$: Observable<IUserProfile>;

  public rank: string[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<IState>,
  ) {
    this.destroy$ = new Subject();
  }

  public ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.store.dispatch(loadProfileAction({ id: paramMap.get('id') }));
    });
    this.loading$ = this.store.pipe(select('profile'), pluck('loading'));
    this.profile$ = this.store.pipe(select('profile'), pluck('profile'));

    this.profile$
      .pipe(takeUntil(this.destroy$), filter<IUserProfile>(Boolean))
      .subscribe(profile => {
        this.generateRank(profile.rank);
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }

  public generateRank(rank: number): void {
    const star = 'star';
    const halfStar = 'star_half';
    const emptyStar = 'star_border';
    switch (rank) {
      case 0:
        this.rank = [emptyStar];
        break;
      case 1:
        this.rank = [halfStar];
        break;
      case 2:
        this.rank = [star];
        break;
      case 3:
        this.rank = [star, halfStar];
        break;
      case 4:
        this.rank = [star, star];
        break;
      case 4:
        this.rank = [star, star, halfStar];
        break;
      case 5:
        this.rank = [star, star, star];
        break;
    }
  }

  public jsonToString(o: Object): string {
    return JSON.stringify(o);
  }

}
