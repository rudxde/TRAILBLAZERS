import {
    ActionReducerMap,
    MetaReducer,
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { navbarReducer, INavbarState } from './navbar.reducre';
import { IHikingRouteState, hikeReducer } from './hike.reducer';
import { IProfileState, profileReducer } from './profile.reducer';
import { IFriendsState, friendsReducer } from './friends.reducer';
import { ISearchState, searchReducer } from './search.reducer';
import { IAuthState, authReducer } from './auth.reducer';
import { IWeatherState, weatherReducer } from './weather.reducer';
import { IMapState, mapReducer } from './map.reducer';

export interface IState {
    navBar: INavbarState;
    hikingRoute: IHikingRouteState;
    profile: IProfileState;
    friends: IFriendsState;
    search: ISearchState;
    auth: IAuthState;
    weather: IWeatherState;
    map: IMapState;
}

export const reducers: ActionReducerMap<IState> = {
    navBar: navbarReducer,
    hikingRoute: hikeReducer,
    profile: profileReducer,
    friends: friendsReducer,
    search: searchReducer,
    auth: authReducer,
    weather: weatherReducer,
    map: mapReducer,
};

export const metaReducers: MetaReducer<IState>[] = !environment.production ? [] : [];
