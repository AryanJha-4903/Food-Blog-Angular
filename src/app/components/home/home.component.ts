import { RecipeCardComponent } from './../recipe-card/recipe-card.component';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CarouselComponent } from "../carousel/carousel.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent,RecipeCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {

  constructor() {}

  ngAfterViewInit(): void {
    $(document).ready(() => {
      console.log("Page and components are fully loaded.");
      // Example: show a loader or perform an action when the page is rendered
      $('#app-carousel').show();
      $('#app-card-list').show();
    });
  }

}
