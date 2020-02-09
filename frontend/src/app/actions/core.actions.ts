import { createAction, props } from '@ngrx/store';
import { ComponentType } from '@angular/cdk/portal';

export const showSnackbarAction = createAction('[Core] show snackbar action', props<{message: string, duration?: number}>());

export const openBottomSheetAction = createAction('[Core] open boom sheet', props<{component: ComponentType<any>}>());
export const closeBottomSheetAction = createAction('[Core] close boom sheet');
