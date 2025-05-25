import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Router, NavigationEnd } from '@angular/router';  // 👈 import these
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Correct property name should be 'styleUrls'
})
export class AppComponent {
  title = 'Recipe-Book';
  showNavbar = true;

  constructor(private router: Router) {
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd)
    )
    .subscribe((event: NavigationEnd) => {
      this.showNavbar = !event.urlAfterRedirects.startsWith('/login');
    });
  }
}
