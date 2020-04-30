import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AUTHModule } from './components/AUTH-Modules/AUTH.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { PageNotFoundComponent } from './components/pages/generalPages/page-not-found/page-not-found.component';
import { WelcomeToTheSiteComponent } from './components/pages/generalPages/welcome-to-the-site/welcome-to-the-site.component';
import { WelcomeUnAuthorisedComponent } from './components/pages/generalPages/welcome-un-authorised/welcome-un-authorised.component';
import { InitilizeLocalStorageComponent } from './components/pages/generalPages/initilize-local-storage/initilize-local-storage.component';
import { EbayNavBarComponent } from './components/pages/ebay/nav-bar/nav-bar.component';
import { HomeNavBarComponent } from './components/pages/home/nav-bar/nav-bar.component';
import { AuctionsComponent } from './components/pages/ebay/auctions/auctions.component';
import { SoldComponent } from './components/pages/ebay/sold/sold.component';
import { CalenderComponent } from './components/pages/home/calender/calender.component';
import { EbayPageNotFoundComponent } from './components/pages/ebay/page-not-found/page-not-found.component';
import { HomePageNotFoundComponent } from './components/pages/home/page-not-found/page-not-found.component';
@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    WelcomeToTheSiteComponent,
    WelcomeUnAuthorisedComponent,
    InitilizeLocalStorageComponent,
    EbayNavBarComponent,
    HomeNavBarComponent,
    AuctionsComponent,
    SoldComponent,
    EbayPageNotFoundComponent,
    CalenderComponent,
    HomePageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule, // ng Angular Bootstrap
    AUTHModule,
    HttpClientModule, // HTTP client
    FormsModule, ReactiveFormsModule, // Forms
  ],
  exports:[
    AUTHModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
