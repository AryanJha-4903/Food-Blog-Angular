import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class RecipeDetailComponent implements OnInit {
  recipeId: string | null = null;
  recipe: any = null;
  loading: boolean = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    // Get the recipe ID from the route params
    this.recipeId = this.route.snapshot.paramMap.get('id');
    if (this.recipeId) {
      this.route.paramMap.subscribe(params => {
        this.recipeId = params.get('id');
        if (this.recipeId) {
        this.fetchRecipeDetails(this.recipeId);
        }
      });
      this.fetchRecipeDetails(this.recipeId);
    }
  }

  fetchRecipeDetails(id: string): void {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

    this.http.get(apiUrl).subscribe((response: any) => {
      if (response.meals && response.meals.length > 0) {
        this.recipe = response.meals[0];
      }
      this.loading = false;
    });
  }

  getIngredients(): string[] {
    const ingredients: string[] = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = this.recipe[`strIngredient${i}`];
      const measure = this.recipe[`strMeasure${i}`];

      if (ingredient && ingredient.trim()) {
        ingredients.push(`${ingredient} - ${measure}`);
      }
    }

    return ingredients;
  }
}
