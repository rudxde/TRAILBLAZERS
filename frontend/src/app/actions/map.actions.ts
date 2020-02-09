import { createAction, props } from '@ngrx/store';
import { Maps } from '@tb/interfaces';

// Start GPS tracking
export const beginTrackAction = createAction('[Map] begin track');
export const endTrackAction = createAction('[Map] end track');

// New Gps Position
export const newPositionAction = createAction('[Map] new Position', props<{ lat: number, lon: number }>());
export const setChunksAction = createAction('[Map] set chunks', props<{ chunks: Maps.IChunk[] }>());
export const setSpeedAction = createAction('[Map] set speed', props<{ speed: number }>());

// Map Viewport Actions
export const setMapRenderViewport = createAction('[Map] set Map Render Settings', props<{ viewport: Maps.IViewport }>());
export const setScaleAction = createAction('[Map] scales', props<{ scale: number }>());
export const setDebugDataAction = createAction('[Map] set debug data', props<{ data: string }>());
