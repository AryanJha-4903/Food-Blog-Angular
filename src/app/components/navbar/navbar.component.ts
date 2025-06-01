import { FormService } from '../../services/form.service';
import { OpenService } from '../../services/open.service';
import { LoginService } from './../../services/login.service';
import { StorageService } from './../../services/storage.service';
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
      @ViewChild('recipeModal') recipeModal!: TemplateRef<any>;

  searchQuery: string = ''; // Change to string for better handling
  searchResults: any; // To hold the search results

  recipeService: any;
profilePic: any = '../../../assets/profile_photo.jpg';
query: any;
showDropdown: boolean = false;
meals: any;
profiles: any;
posts: any;
  sessionProfile: any;
selectedMeal: any;

  constructor(
// Inject SearchService
    private modalService: NgbModal,
    private openService: OpenService,
    private formService: FormService,
    private StorageService: StorageService,
    private LoginService: LoginService,
    private router: Router // Inject Router for navigation
  ) { }
  isLoggedIn$: any; // Flag to check if user is logged in
  ngOnInit(): void {

    this.isLoggedIn$ = this.LoginService.isLoggedIn$; // Initialize after LoginService is constructed
    this.sessionProfile = this.StorageService.getItem('profile');
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

  onSearch(){
    if (this.query.trim() === '') {
      this.searchResults = []; // Clear results if query is empty
      return;
    }
    this.showDropdown = false;
    this.formService.getSearchResults(this.query, 0, 10).subscribe(
      (response) => {
        this.searchResults = response; // Assuming response.data contains the search results
        this.profiles = this.searchResults?.profiles || [];
        this.meals =  this.searchResults?.meals || [];
        this.posts = this.searchResults?.posts;
        this.showDropdown = true;
        console.log("search=>",this.searchResults)

      },
      (error) => {
        console.error('Error fetching search results:', error);
        this.showDropdown = false;
        this.searchResults = []; // Clear results on error
      }
    );
  }

  clearQuery() {
  this.query = '';
  this.showDropdown = false;
  this.onSearch(); // Optional: Trigger search with empty string
}

   gotoviewProfile(userid: string) {
    // this.StorageService.setItem('viewProfile', userid);
    if (this.sessionProfile.userId == userid) {
      this.router.navigate(['/profile']);
    }else {
    this.router.navigate(['/viewprofile', userid]);
    }
    this.showDropdown = false
  }
 openRecipeModal(meal: any): void {
    // this.selectedMeal = this.(meal);
    this.getDetailedreciepe(meal?.idMeal)
    this.modalService.open(this.recipeModal, { centered: true, size: 'lg' });
  }
getIngredients(meal: any): string[] {
  const ingredients: string[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      const item = measure && measure.trim() ? `${ingredient} - ${measure}` : ingredient;
      ingredients.push(item);
    }
  }

  return ingredients;
}
  getDetailedreciepe(id: string){
    this.openService.getDetailedRecipe(id).subscribe({
      next:(response)=>{
        this.selectedMeal = response.meals[0]
      },error: (err)=>{
        console.error(err)
      }
    })
  }



}
