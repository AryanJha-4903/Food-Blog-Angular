import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbCarouselModule, NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ProfileComponent } from './components/Profile/Profile.component';
import { HomeComponent } from './components/home/home.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
// import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessagingComponent } from './components/messaging/messaging.component';
import { SettingsComponent } from './components/Settings/Settings.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxLoadingModule } from "ngx-loading";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
@NgModule({
  declarations: [
    NavbarComponent,
    ProfileComponent,
    LoginPageComponent,
    HomeComponent,
    AppComponent,
    MessagingComponent,
    SettingsComponent, // Uncomment this line if you have a SettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    AppRoutingModule,
    CarouselModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    NgxSpinnerModule,
    InfiniteScrollModule,
    NgxLoadingModule.forRoot({}),
  ],
  providers: [
    provideHttpClient() // Use this to configure HttpClient
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
