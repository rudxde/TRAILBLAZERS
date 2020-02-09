import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { IState } from 'src/app/reducers';
import { IRegistration } from '@tb/interfaces';
import { nameValidators, nickNameValidators, passwordValidators, isSameAsValidator } from 'src/app/lib/validators';
import { registrationAction, navigateToRouteAction } from '../../actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
type ToFormGroupDef<T> = {
  [P in keyof T]: FormControl;
};

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.less']
})
export class RegistrationComponent implements OnInit {

  public form: FormGroup = new FormGroup(<ToFormGroupDef<Partial<IRegistration>>> {
    nickName: new FormControl('', [...nickNameValidators]),
    firstName: new FormControl('', [Validators.required, ...nameValidators]),
    lastName: new FormControl('', [Validators.required, ...nameValidators]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [...passwordValidators]),
    passwordRetry: new FormControl('', isSameAsValidator(() => this.control('password'))),
    acceptAgbs: new FormControl(false, [Validators.requiredTrue]),
  });

  public pending$: Observable<boolean>;

  constructor(
    private store: Store<IState>,
  ) {}

  public ngOnInit(): void {
    this.pending$ = this.store.pipe(select('auth', 'loginPending')).pipe(map(x => x === 'loading'));
  }

  public control(name: string): AbstractControl {
    return this.form.controls[name];
  }

  public register(): void {
    if (this.form.valid) {
      this.store.dispatch(registrationAction({
        registration: {
          login: this.form.value.nickName,
          ...this.form.value,
        }
      }));
    }
  }

  public abbort(): void {
    this.store.dispatch(navigateToRouteAction({route: '/login'}));
  }

}
