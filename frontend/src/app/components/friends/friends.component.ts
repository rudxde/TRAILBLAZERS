import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserProfile } from '@tb/interfaces';
import { IState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { loadFriendsAction, navigateToRouteAction } from 'src/app/actions';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.less']
})
export class FriendsComponent implements OnInit {

  public loading$: Observable<string>;
  public friends$: Observable<IUserProfile[]>;

  constructor(
    private store: Store<IState>,
  ) { }

  public ngOnInit(): void {
    this.store.dispatch(loadFriendsAction());
    this.friends$ = this.store.pipe(select('friends'), pluck('profiles'));
    this.loading$ = this.store.pipe(select('friends'), pluck('loading'));
  }

  public navigateToProfile(id: string): void {
    this.store.dispatch(navigateToRouteAction({route: `/profile/${id}`}));
  }

}
