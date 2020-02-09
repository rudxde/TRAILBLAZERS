import { createReducer, on, Action } from '@ngrx/store';
import {
    newPositionAction,
    setChunksAction,
    setScaleAction,
    setMapRenderViewport,
    setDebugDataAction,
    setSpeedAction,
    endTrackAction,
} from '../actions/map.actions';
import { Maps } from '@tb/interfaces';

export interface IExtendedChunk extends Maps.IChunk {
    nodeMap: Map<string, Maps.IOsmNode>;
}

export interface IMapState {
    position: {
        lon: number,
        lat: number,
    };
    viewport: Maps.IViewport;
    speed: number;
    speedRating: Maps.ISpeedDataState;
    loadedChunks: Maps.IChunk[];
    reducedChunk: IExtendedChunk;
    isTracking: boolean;
    debugData: string;
}

export const initialState: IMapState = {
    position: {
        lon: 0,
        lat: 0,
    },
    viewport: {
        height: 0,
        width: 0,
        scale: 0,
        preRenderBorderWidth: 0,
    },
    speedRating: 'initial',
    speed: 0,
    loadedChunks: [],
    reducedChunk: reduceChunks([]),
    isTracking: false,
    debugData: '',
};

function speedToSpeedRating(speed: number): Maps.ISpeedDataState {
    if (speed < 1) return 'pause';
    if (speed < 3) return 'slow';
    if (speed < 7) return 'walking';
    if (speed < 20) return 'running';
    return 'driving';
}

export function mapReducer<A extends Action>(state: IMapState, action: A): IMapState {
    return createReducer<IMapState>(
        initialState,
        on(newPositionAction, (state, { lat, lon }) => ({ ...state, position: { lat, lon }, isTracking: true })),
        on(endTrackAction, state => ({
            ...state,
            isTracking: false,
            position: { lat: 0, lon: 0 },
            loadedChunks: [],
            reducedChunk: reduceChunks([]),
            speedRating: 'initial',
            speed: 0,
        })),
        on(setChunksAction, (state, { chunks }) => ({ ...state, loadedChunks: chunks, reducedChunk: reduceChunks(chunks) })),
        on(setScaleAction, (state, { scale }) => ({ ...state, viewport: { ...state.viewport, scale } })),
        on(setMapRenderViewport, (state, { viewport }) => ({ ...state, viewport })),
        on(setDebugDataAction, (state, { data }) => ({ ...state, debugData: data })),
        on(setSpeedAction, (state, { speed }) => ({ ...state, speed: speed, speedRating: speedToSpeedRating(speed) })),
    )(state, action);
}

function reduceChunks(chunks: Maps.IChunk[]): IExtendedChunk {
    const a = chunks.reduce<Maps.IChunk>((acc, val) => (<Maps.IChunk>{
        id: '',
        nodes: [...acc.nodes, ...val.nodes],
        ways: [...acc.ways, ...val.ways],
    }), { id: '', nodes: [], ways: [] });
    return { ...a, nodeMap: nodesToMap(a.nodes) };
}

function nodesToMap(nodes: Maps.IOsmNode[]): Map<string, Maps.IOsmNode> {
    const map = new Map<string, Maps.IOsmNode>();
    nodes.forEach(x => map.set(x.id, x));
    return map;
}
