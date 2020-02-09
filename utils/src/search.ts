import { SearchFilterT, IHikingRouteSearchQuery } from '@tb/interfaces';

export function searchFilterToQuery(searchFilter: SearchFilterT[]): IHikingRouteSearchQuery {
    return searchFilter.reduce<Partial<IHikingRouteSearchQuery>>((acc, val) => ({ ...acc, ...val.value }), {}) as IHikingRouteSearchQuery;
}
