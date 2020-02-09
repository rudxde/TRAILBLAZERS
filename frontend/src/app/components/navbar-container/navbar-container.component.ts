import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { closeAction, openAction } from '../../actions/';
import { IState } from '../../reducers';
import { pluck, takeUntil } from 'rxjs/operators';
import { ISpecialAction } from 'src/app/reducers/navbar.reducre';
import { TypedAction } from '@ngrx/store/src/models';

@Component({
  selector: 'app-navbar-container',
  templateUrl: './navbar-container.component.html',
  styleUrls: ['./navbar-container.component.less']
})
export class NavbarContainerComponent implements OnDestroy {

  public opened$: Observable<boolean>;
  public title$: Observable<string>;
  public specialAction$: Observable<ISpecialAction>;
  public specialActionAction: TypedAction<string>;

  private destroy$: Subject<void>;

  constructor(
    private store: Store<IState>,
  ) {
    this.destroy$ = new Subject();
    this.opened$ = store.pipe(select('navBar'), pluck('sideBarOpened'));
    this.title$ = store.pipe(select('navBar'), pluck('title'));
    this.specialAction$ = store.pipe(select('navBar'), pluck('specialAction'));
    this.specialAction$
      .pipe(takeUntil(this.destroy$))
      .subscribe(x => this.specialActionAction = x ? x.action : undefined);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }

  public openNavbar(): void {
    this.store.dispatch(openAction());
  }
  public closeNavbar(): void {
    this.store.dispatch(closeAction());
  }

  public dispatchSpecialAction(): void {
    if (this.specialActionAction) {
      this.store.dispatch(this.specialActionAction);
    }
  }

}
