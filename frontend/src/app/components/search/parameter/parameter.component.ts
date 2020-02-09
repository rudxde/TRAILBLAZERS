import { Component, OnDestroy } from '@angular/core';
import { ITimeSpan, SearchFilterT } from '@tb/interfaces';
import { HikingRouteDifficultyToString } from '@tb/utils';
import { Store, select } from '@ngrx/store';
import { IState } from 'src/app/reducers';
import { updateSearchFilterAction, closeBottomSheetAction } from 'src/app/actions';
import { pluck, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.less']
})
export class ParameterComponent implements OnDestroy {

  public allDifficulties: { name: string, value: number }[];

  public destroy$: Subject<void>;
  public filter: SearchFilterT;

  public durationForm: FormGroup;
  public locationForm: FormGroup;

  constructor(
    private store: Store<IState>,
  ) {
    this.destroy$ = new Subject();
    this.store
      .pipe(select('search'), pluck('editFilter'), takeUntil(this.destroy$))
      .subscribe(x => {
        if (x.type === 'difficulty') {
          this.durationForm = new FormGroup({
            dificultyFromSelect: new FormControl(x.value.difficultyFrom),
            dificultyToSelect: new FormControl(x.value.difficultyTo),
          });
          this.durationForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
            this.filter.value = {
              ...this.filter.value,
              difficultyFrom: value.dificultyFromSelect,
              difficultyTo: value.dificultyToSelect,
            };
          });
          this.allDifficulties = new Array(4).fill(0).map((_, index) => ({ value: index, name: HikingRouteDifficultyToString(index) })).slice(1);
        } else if (x.type === 'location') {
          this.locationForm = new FormGroup({
            location: new FormControl(x.value.atLocation ? x.value.atLocation.location : ''),
            distance: new FormControl(x.value.atLocation ? x.value.atLocation.distance : 0)
          });
          this.locationForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
            this.filter.value = {
              ...this.filter.value,
              atLocation: value
            };
          });
        }
        this.filter = { ...x };
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }

  public setDurationMin(x: ITimeSpan): void {
    this.filter.value = { ...this.filter.value, minDuration: x };
  }

  public setDurationMax(x: ITimeSpan): void {
    this.filter.value = { ...this.filter.value, maxDuration: x };
  }

  public update(): void {
    this.store.dispatch(updateSearchFilterAction({ filter: this.filter }));
  }

  public cancel(): void {
    this.store.dispatch(closeBottomSheetAction());
  }

  public clear(): void {
    this.filter.value= {};
      this.store.dispatch(updateSearchFilterAction({filter: this.filter }));
  }
}
