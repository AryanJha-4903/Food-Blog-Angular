import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, lastValueFrom } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = 'https://www.themealdb.com/api/json/v1/1/random.php';

  constructor(private http: HttpClient) {}

  /**
   * Fetch a specified number of random recipes asynchronously using forkJoin.
   * Ensures all entries are unique.
   * @param count Number of recipes to fetch
   * @returns Promise with the list of unique recipes
   */
  async getRandomRecipes(count: number): Promise<any[]> {
    // const requests = Array(count).fill(null).map(() => this.http.get(this.apiUrl).pipe(delay(500)));
    const requests = Array(count).fill(null).map(() => {
      const apiUrlWithTimestamp = `${this.apiUrl}?_=${Date.now()}`;
      return this.http.get(apiUrlWithTimestamp);
    });


    const responses = await lastValueFrom(
      forkJoin(requests).pipe(
        map((responses: any[]) =>
          responses.map(response => ({
            id: response.meals[0].idMeal,
            title: response.meals[0].strMeal,
            image: response.meals[0].strMealThumb,
          }))
        )
      )
    );

    // Remove duplicates based on recipe IDs
    // const uniqueRecipes = new Map();
    // responses.forEach(recipe => {
    //   if (!uniqueRecipes.has(recipe.id)) {
    //     uniqueRecipes.set(recipe.id, recipe);
    //   }
    // });

    return responses;
  }
}
