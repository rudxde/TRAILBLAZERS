import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IState } from 'src/app/reducers';
import { loginAction, navigateToRouteAction } from 'src/app/actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {
  public form: FormGroup = new FormGroup({
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  constructor(
    private store: Store<IState>,
  ) { }

  public control(name: string): AbstractControl {
    return this.form.controls[name];
  }

  public login(): void {
    if (this.form.valid) {
      this.store.dispatch(loginAction(this.form.value));
    }
  }

  public register(): void {
    this.store.dispatch(navigateToRouteAction({ route: '/register' }));
  }

}
