import { Component } from '@angular/core';
import { IState } from '../../reducers';
import { Store } from '@ngrx/store';
import { navigateToRouteAction, showSnackbarAction, logoutAction } from 'src/app/actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent {

  public entrys = [
    { title: 'Home', route: '/home' },
    { title: 'Suche', route: '/search' },
    { title: 'Freunde', route: '/friends' },
    { title: 'Profil', route: '/profile/me' },
  ];

  constructor(
    private store: Store<IState>,
  ) { }

  public navigate(toRoute: string): void {
    this.store.dispatch(navigateToRouteAction({ route: toRoute }));
  }

  public logout(): void {
    this.store.dispatch(logoutAction());
  }

  public settings(): void {
    this.store.dispatch(showSnackbarAction({message: 'Not implemented!'}));
  }

}
