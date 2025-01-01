import { HttpClientModule } from '@angular/common/http';
// // import { Component } from '@angular/core';

// // @Component({
// //   selector: 'app-navbar',
// //   standalone: true,
// //   imports: [],
// //   templateUrl: './navbar.component.html',
// //   styleUrl: './navbar.component.css'
// // })
// // export class NavbarComponent {

// // }
// // src/app/components/navbar/navbar.component.ts
// import { Component, OnInit } from '@angular/core';
// import { CategoryService } from '../../services/category.service';

// import { Category } from '../../models/category.model';

// import { FormsModule } from '@angular/forms'; // Import FormsModule
// @Component({
//   selector: 'app-navbar',
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.css'],
//   standalone: true,  // Mark as a standalone component
//   imports: [CommonModule, FormsModule, RouterModule]  // Import necessary modules
// })
// export class NavbarComponent implements OnInit {
//   categories: Category[] = [];
//   searchQuery: string = '';

//   constructor(private categoryService: CategoryService, private router: Router) { }

//   ngOnInit(): void {
//     this.fetchCategories();
//   }

//   fetchCategories(): void {
//     this.categoryService.getCategories().subscribe((data: Category[]) => {
//       this.categories = data;
//     });
//   }

//   onSearch(): void {
//     if (this.searchQuery.trim()) {
//       this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
//     }
//   }
// }


// import { Component, model, OnInit } from '@angular/core';
// import { CategoryService } from '../../services/category.service';
// import { Category } from '../../models/category.model';
// import { Router, RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-navbar',
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.css'],
//   standalone: true,
//   imports: [CommonModule, RouterModule, FormsModule]
// })
// export class NavbarComponent implements OnInit {

//   searchQuery: any;

//   onSearch() {
//   throw new Error('Method not implemented.');
//   }

//   categories: Category[] = [];

//   constructor(private categoryService: CategoryService) { }

//   ngOnInit(): void {
//     this.fetchCategories();
//   }

//   fetchCategories(): void {
//     this.categoryService.getCategories().subscribe((data: { categories: Category[] }) => {
//       this.categories = data.categories;
//     });
//   }
// }



import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { SearchService } from '../../services/search.service'; // Adjust path if necessary

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class NavbarComponent implements OnInit {
  searchQuery: string = ''; // Change to string for better handling
  searchResults: any[] = []; // To hold the search results
  categories: Category[] = [];
  recipeService: any;

  constructor(
    private categoryService: CategoryService,
    private searchService: SearchService, // Inject SearchService
    private router: Router // Inject Router for navigation
  ) { }

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.categoryService.getCategories().subscribe((data: { categories: Category[] }) => {
      this.categories = data.categories;
    });
  }

  onSearch(event: Event): void {
    // Call the search method from the recipe service
    this.searchService.searchRecipes(this.searchQuery).subscribe((data: any) => {
      this.searchResults = data.meals || []; // Store the search results
      console.log(this.searchResults);
      if (this.searchResults.length > 0) {
        // Redirect to recipe-detail component with the first search result ID
        this.router.navigate(['/recipe-detail', this.searchResults[0].idMeal]);
      } else {
        // Redirect to home page and show modal if no results found
        this.router.navigate(['/home']).then(() => {
          alert('No recipe found'); // Replace with your modal implementation
        });
      // Refresh the current route
      this.router.navigateByUrl(this.router.url);
      }
    }, (error: any) => {
      console.error('Error fetching search results:', error);
    });
  }

}
