import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { IState } from 'src/app/reducers';
import { closeBottomSheetAction, updateProfileAction, showSnackbarAction, openChangePasswordAction } from 'src/app/actions';
import { pluck, takeUntil } from 'rxjs/operators';
import { IUserProfile } from '@tb/interfaces';
import { Subject, Observable } from 'rxjs';
import { nameValidators, nickNameValidators } from 'src/app/lib/validators';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.less']
})
export class EditProfileComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public pending$: Observable<boolean>;
  private destroy$: Subject<void>;

  constructor(
    private store: Store<IState>,
  ) {
    this.destroy$ = new Subject();
  }

  public control(name: string): AbstractControl {
    return this.form.controls[name];
  }

  public ngOnInit(): void {
    this.store
      .pipe(select('profile'), pluck('profile'), takeUntil(this.destroy$))
      .subscribe((user: IUserProfile) => {
        this.form = new FormGroup({
          firstName: new FormControl(user.firstName, [...nameValidators]),
          lastName: new FormControl(user.lastName, [...nameValidators]),
          email: new FormControl(user.email, [Validators.email]),
          nickName: new FormControl(user.nickName, [...nickNameValidators]),
          picturePath: new FormControl(user.picturePath),
        });
      });
      this.pending$ = this.store.pipe(select('profile', 'updatePending'));
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }

  public update(): void {
    if (this.form.valid) {
      this.store.dispatch(updateProfileAction({ updatedProfile: this.form.value }));
    } else {
      this.store.dispatch(showSnackbarAction({ message: 'Bitte korrigieren Sie ihre Angaben!' }));
    }
  }

  public changePassword(): void {
    this.store.dispatch(openChangePasswordAction());
  }

  public cancel(): void {
    this.store.dispatch(closeBottomSheetAction());
  }

}
