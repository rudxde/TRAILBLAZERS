import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { ErrorComponent } from '../components/error/error.component';
import { FriendsComponent } from '../components/friends/friends.component';
import { PlanComponent } from '../components/plan/plan.component';
import { SearchComponent } from '../components/search/search.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { SearchResultsComponent } from '../components/search/results/results.component';
import { LoginComponent } from '../components/login/login.component';
import { AuthenticatedFrameComponent } from '../components/app/authenticated-frame/authenticated-frame.component';
import { AuthGuard } from '../guards/auth-guard';
import { RegistrationComponent } from '../components/registration/registration.component';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { HikingRouteDetailsComponent } from '../components/hiking-route-details/hiking-route-details.component';
import { HikeComponent } from '../components/hike/hike.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  {
    path: '', component: AuthenticatedFrameComponent, canActivate: [AuthGuard], children: [
      { path: '', pathMatch: 'full', redirectTo: '/home' },
      { path: 'home', component: HomeComponent },
      { path: 'search', component: SearchComponent },
      { path: 'search/results', component: SearchResultsComponent },
      { path: 'hiking-route/:id', component: HikeComponent },
      { path: 'plan', component: PlanComponent },
      { path: 'friends', component: FriendsComponent },
      { path: 'navigation', component: NavigationComponent },
      { path: 'profile/:id', component: ProfileComponent },
      { path: 'hiking-route-details/:id', component: HikingRouteDetailsComponent },
    ],
  },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
