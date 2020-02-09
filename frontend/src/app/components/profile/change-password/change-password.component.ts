import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { IState } from 'src/app/reducers';
import { closeBottomSheetAction, showSnackbarAction, changePasswordAction } from 'src/app/actions';
import { Auth } from '@tb/interfaces';
import { Subject, Observable } from 'rxjs';
import { isSameAsValidator, passwordValidators } from 'src/app/lib/validators';

type ToFormGroupDef<T> = {
  [P in keyof T]: FormControl;
};

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

  public form: FormGroup = new FormGroup(<ToFormGroupDef<Auth.IChangePasswordRequest>>{
    oldPassword: new FormControl('', [...passwordValidators]),
    newPassword: new FormControl('', [...passwordValidators]),
    newPasswordRetry: new FormControl('', [isSameAsValidator(() => this.control('newPassword'))]),
  });
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
    this.pending$ = this.store.pipe(select('profile', 'updatePending'));
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }

  public update(): void {
    if (this.form.valid) {
      this.store.dispatch(changePasswordAction({ changePasswort: this.form.value }));
    } else {
      this.store.dispatch(showSnackbarAction({ message: 'Bitte korrigieren Sie ihre Angaben!' }));
    }
  }

  public cancel(): void {
    this.store.dispatch(closeBottomSheetAction());
  }

}
