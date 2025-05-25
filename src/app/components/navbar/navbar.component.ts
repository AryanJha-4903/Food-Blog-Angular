import { LoginService } from './../../services/login.service';
import { StorageService } from './../../services/storage.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  searchQuery: string = ''; // Change to string for better handling
  searchResults: any[] = []; // To hold the search results

  recipeService: any;
profilePic: any = '../../../assets/profile_photo.jpg';

  constructor(
// Inject SearchService
    private StorageService: StorageService,
    private LoginService: LoginService,
    private router: Router // Inject Router for navigation
  ) { }
  isLoggedIn$: any; // Flag to check if user is logged in
  ngOnInit(): void {

    this.isLoggedIn$ = this.LoginService.isLoggedIn$; // Initialize after LoginService is constructed
  }

  navigateToProfile(){
    let item = this.StorageService.getItem("profile")
    this.StorageService.setItem("profile-page", item )
    this.router.navigate(['/profile']);
  }

  navigateToHome(): any{
    this.router.navigate(['/home']);
  }
  navigatetoSetting(){
    this.router.navigate(['/settings'])
  }



  logout(){
    this.LoginService.logout(); // Call the logout method from the login service
    // this.isLoggedIn = false; // Update the login status
    this.router.navigate(['/login']); // Redirect to home page after logout
    // alert('Logged out successfully'); // Show logout success message
  }
  messages = [
    {
      image: 'assets/images/users/user-6.png',
      user: 'Susan P. Jarvis',
      text: 'This party is going to have a DJ, food, and drinks.'
    },
    {
      image: 'assets/images/users/user-5.png',
      user: 'Ruth D. Greene',
      text: 'Great, I’ll see you tomorrow!.'
    },
    {
      image: 'assets/images/users/user-7.png',
      user: 'Kimberly R. Hatfield',
      text: 'yeah, I will be there.'
    },
    {
      image: 'assets/images/users/user-8.png',
      user: 'Joe S. Feeney',
      text: 'I would really like to bring my friend Jake, if...'
    },
    {
      image: 'assets/images/users/user-9.png',
      user: 'William S. Willmon',
      text: 'Sure, what can I help you with?'
    },
    {
      image: 'assets/images/users/user-10.png',
      user: 'Sean S. Smith',
      text: 'Which of those two is best?'
    }
  ];






}
