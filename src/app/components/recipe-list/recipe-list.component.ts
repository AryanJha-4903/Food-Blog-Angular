import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouteConfigLoadEnd, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeDetailComponent } from '../recipe-detail/recipe-detail.component';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
  standalone: true,
  imports: [CommonModule, RecipeDetailComponent, RouterLink, RouterModule]
})
export class RecipeListComponent implements OnInit {
  recipes: any[] = [];
  loading: boolean = true;
  category: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.category = params.get('category') || '';
      this.fetchRecipesByCategory(this.category);
    });
  }

  fetchRecipesByCategory(category: string): void {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
    this.http.get<any>(apiUrl).subscribe(response => {
      this.recipes = response.meals;
      this.loading = false;
    });
  }
}
