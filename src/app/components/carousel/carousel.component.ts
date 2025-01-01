import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Recipe } from '../../models/recipe.model';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as jQuery from 'jquery';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class CarouselComponent implements OnInit, AfterViewInit {
  recipes: Recipe[] = [];
  loading: boolean = true;

   constructor(private http: HttpClient, private cd: ChangeDetectorRef, private route: ActivatedRoute, private recipeService: RecipeService) {}


  async ngOnInit(): Promise<void> {
    this.loading = true;
    try {
      this.recipes = await this.recipeService.getRandomRecipes(10);
      console.log('Recipes:', this.recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      this.loading = false;
    }
  }

  ngAfterViewInit(): void {
    const $ = jQuery.noConflict();

    // Type assertion to avoid the TypeScript error
    ($('#recipeCarousel') as any).carousel({
      interval: 2000
    });

    ($(`#recipeCarousel`) as any).on('slide.bs.carousel', function () {
      console.log('Carousel sliding');
    });
  }

  // fetchRecipes(): void {
  //   const requests: Observable<any>[] = [];

  //   for (let i = 0; i < 6; i++) {
  //     requests.push(this.http.get('https://www.themealdb.com/api/json/v1/1/random.php'));
  //   }

  //   forkJoin(requests).subscribe(responses => {
  //     this.recipes = responses.map(response => ({
  //       id: response.meals[0].idMeal,
  //       title: response.meals[0].strMeal,
  //       image: response.meals[0].strMealThumb
  //     }));
  //     this.loading = false;
  //   });
  // }
}
