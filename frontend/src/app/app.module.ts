import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './modules/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './components/app/app.component';
import { MaterialModule } from './modules/material.module';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NavbarContainerComponent } from './components/navbar-container/navbar-container.component';
import { EffectsModule } from '@ngrx/effects';
import { effects } from './effects';
import { SearchComponent } from './components/search/search.component';
import { PlanComponent } from './components/plan/plan.component';
import { FriendsComponent } from './components/friends/friends.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HikeRecommendationComponent } from './components/home/hike-recommendation/hike-recommendation.component';
import { HikeService } from './services/hike/hike.service';
import { TimespanPipe } from './pipes/timespan.pipe';
import { DistanceKmPipe } from './pipes/distance-km.pipe';
import {HtmlTagRm} from './pipes/html-tag-rm';
import { HttpClientModule } from '@angular/common/http';
import { SearchResultsComponent } from './components/search/results/results.component';
import { ProfileService } from './services/profile/profile.service';
import { NextRouteComponent } from './components/home/next-route/next-route.component';
import { ParameterComponent } from './components/search/parameter/parameter.component';
import { DurationPickerComponent } from './components/core/duration-picker/duration-picker.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EditProfileComponent } from './components/profile/edit-profile/edit-profile.component';
import { AuthService } from './services/auth/auth.service';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth-guard';
import { AuthenticatedFrameComponent } from './components/app/authenticated-frame/authenticated-frame.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { HttpService } from './services/http/http.service';
import { ChangePasswordComponent } from './components/profile/change-password/change-password.component';
import { WeatherService } from './services/weather/weather.service';
import { WeatherForecastComponent } from './components/home/weather-forecast/weather-forecast.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PositionService } from './services/position/position.service';
import { PositionMockService } from './services/position/position-mock.service';
import { MapService } from './services/map/map.service';
import { RateHikeComponent } from './components/rate-hike/rate-hike.component';
import { HikingRouteDetailsComponent } from './components/hiking-route-details/hiking-route-details.component';
import { HikeComponent } from './components/hike/hike.component';
import { HikingRouteComponent } from './components/hike/hiking-route/hiking-route.component';
import { MatListModule, MatInputModule } from '@angular/material';

const useGpsMock: boolean = false;//= Boolean(tbEnv.map.useGpsMock);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorComponent,
    NavbarComponent,
    NavbarContainerComponent,
    SearchComponent,
    PlanComponent,
    FriendsComponent,
    ProfileComponent,
    HikeRecommendationComponent,
    TimespanPipe,
    DistanceKmPipe,
    HtmlTagRm,
    SearchResultsComponent,
    HikingRouteComponent,
    NextRouteComponent,
    WeatherForecastComponent,
    ParameterComponent,
    DurationPickerComponent,
    EditProfileComponent,
    LoginComponent,
    AuthenticatedFrameComponent,
    RegistrationComponent,
    ChangePasswordComponent,
    NavigationComponent,
    RateHikeComponent,
    HikingRouteDetailsComponent,
    HikeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    StoreModule.forRoot(
      reducers,
      {
        metaReducers,
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true
        }
      },
    ),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({
      maxAge: 10
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    ReactiveFormsModule,
    MatListModule,
    FormsModule,
    MatInputModule,
  ],
  providers: [
    HikeService,
    ProfileService,
    WeatherService,
    ProfileService,
    AuthService,
    AuthGuard,
    HttpService,
    { provide: PositionService, useClass: !useGpsMock ? PositionService : PositionMockService },
    MapService,
  ],
  bootstrap: [
    AppComponent,
  ],
  entryComponents: [
    ParameterComponent,
    EditProfileComponent,
    ChangePasswordComponent,
    RateHikeComponent,
  ]
})
export class AppModule { }
