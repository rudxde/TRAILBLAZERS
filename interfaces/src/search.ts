import { ITimeSpan } from './time-span';
import { HikingRouteDifficulty } from './hiking-routes';
import { Maps } from './map';

export interface IHikingRouteSearchQuery {
    atLocation: {location: string} & Record<'distance', number>;
    minDuration: ITimeSpan;
    maxDuration: ITimeSpan;
    difficultyFrom: HikingRouteDifficulty;
    difficultyTo: HikingRouteDifficulty;
}

export type SearchFilterTypeT = 'duration' | 'difficulty' | 'location';
export type SearchFilterT = { id: string, name: string, type: SearchFilterTypeT, value: Partial<IHikingRouteSearchQuery> };
