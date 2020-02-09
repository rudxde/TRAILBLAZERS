import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IState } from 'src/app/reducers';
import { setSpecialActionAction, navigateToRouteAction } from 'src/app/actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor(
    private store: Store<IState>,
  ) { }

  public ngOnInit(): void {
    this.store.dispatch(setSpecialActionAction({ specialAction: { icon: 'search', action: navigateToRouteAction({ route: '/search' }) } }));
  }

}
