import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
    openSearchFilterAction,
    updateSearchFilterAction,
    openBottomSheetAction,
    closeBottomSheetAction,
} from '../actions';
import { map } from 'rxjs/operators';
import { ParameterComponent } from '../components/search/parameter/parameter.component';

@Injectable()
export class SearchEffects {

    public openSearchFilter$ = createEffect(() => this.actions$.pipe(
        ofType(openSearchFilterAction),
        map(() => openBottomSheetAction({ component: ParameterComponent })),
    ));

    public updateSearchFilter$ = createEffect(() => this.actions$.pipe(
        ofType(updateSearchFilterAction),
        map(() => closeBottomSheetAction()),
    ));

    constructor(
        private actions$: Actions,
    ) { }

}
