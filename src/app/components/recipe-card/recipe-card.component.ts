import { routes } from './../../app.routes';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { forkJoin, Observable } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class RecipeCardComponent implements OnInit {
  recipes: any[] = [];
  loading: boolean = true;

  constructor(private http: HttpClient, private cd: ChangeDetectorRef, private route: ActivatedRoute, private recipeService: RecipeService) {}

  async ngOnInit(): Promise<void> {
      this.loading = true;
      try {
        this.recipes = await this.recipeService.getRandomRecipes(12);
        console.log('Recipes:', this.recipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        this.loading = false;
      }
    }

  }
  // fetchRandomRecipes(): void {
  //   this.recipeService.getRandomRecipe(20).subscribe((requests: any[]) => {
  //     console.log("test request", requests);
  //     this.recipes = requests;
  //     this.loading = false;
  //   });

  // }
