import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ProfileComponent } from './components/Profile/Profile.component';
import { MessagingComponent } from './components/messaging/messaging.component';
import { SettingsComponent } from './components/Settings/Settings.component';
import { authGuard } from './services/auth.guard';

// Define the application routes
export const routes: Routes = [
  {path: 'messages', component: MessagingComponent , canActivate:[authGuard]}, // Route for messages page
  { path: 'home', component: HomeComponent,canActivate:[authGuard] },
  { path: 'settings', component: SettingsComponent, canActivate:[authGuard] }, // Route for settings page
  {path: 'login', component: LoginPageComponent}, // Route for login page
  {path: 'profile', component: ProfileComponent, canActivate:[authGuard]}, // Route for profile page
  {path: 'viewprofile/:userid', component: ProfileComponent, canActivate:[authGuard]}, // Route for profile with username parameter
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to home on an empty path
  { path: '**', redirectTo: '/login' } // Wildcard route to handle unknown paths
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {} // Export the routing module
