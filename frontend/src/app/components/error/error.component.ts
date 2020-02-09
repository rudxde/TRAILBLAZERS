import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IState } from '../../reducers';
import { setTitleAction } from 'src/app/actions';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.less']
})
export class ErrorComponent implements OnInit {

  constructor(
    private store: Store<IState>,
  ) { }

  public ngOnInit(): void {
    this.store.dispatch(setTitleAction({ text: 'Error' }));
  }

}
