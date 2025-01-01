import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';

// Define the application routes
export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'recipe-detail/:id', component: RecipeDetailComponent }, // Route for recipe detail
  { path: 'recipes/:category', component: RecipeListComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to home on an empty path
  { path: '**', redirectTo: '/home' } // Wildcard route to handle unknown paths
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {} // Export the routing module
