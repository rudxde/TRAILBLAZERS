import { Component, OnInit, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { ITimeSpan } from '@tb/interfaces';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-duration-picker',
  templateUrl: './duration-picker.component.html',
  styleUrls: ['./duration-picker.component.less']
})
export class DurationPickerComponent implements OnInit, OnDestroy {

  @Input() public label: string | undefined;
  @Output() public value: EventEmitter<ITimeSpan>;

  public hours: number[];
  public minutes: number[];

  public form = new FormGroup({
    hour: new FormControl(0, [Validators.required]),
    minute: new FormControl(0, [Validators.required]),
  });

  private destroy$: Subject<void> = new Subject();

  constructor() {
    this.hours = (new Array(24)).fill(0).map((_, index) => index);
    this.minutes = (new Array(59)).fill(0).map((_, index) => index);
    this.value = new EventEmitter();
  }

  public ngOnInit(): void {
    this.form.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe(
      x => this.value.emit({
        hours: x.hour,
        min: x.minute,
      })
    );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }

}
