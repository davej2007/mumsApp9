import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AUTHModule } from './components/AUTH-Modules/AUTH.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokenInterceptorService } from './components/custom/resolvers/token-interceptor.service';

// General Pages
import { PageNotFoundComponent }          from './components/pages/generalPages/page-not-found/page-not-found.component';
import { WelcomeToTheSiteComponent }      from './components/pages/generalPages/welcome-to-the-site/welcome-to-the-site.component';
import { WelcomeUnAuthorisedComponent }   from './components/pages/generalPages/welcome-un-authorised/welcome-un-authorised.component';
import { InitilizeLocalStorageComponent } from './components/pages/generalPages/initilize-local-storage/initilize-local-storage.component';
import { EbayPageNotFoundComponent } from './components/pages/ebayPages/ebay-page-not-found/ebay-page-not-found.component';
import { EbayNavBarComponent } from './components/pages/ebayPages/ebay-nav-bar/ebay-nav-bar.component';
import { AuctionTableComponent } from './components/pages/ebayPages/auction-table/auction-table.component';
// Ebay Pages

// Home Pages

// pipes

// modals

@NgModule({
  declarations: [
    AppComponent,
    WelcomeToTheSiteComponent,
    WelcomeUnAuthorisedComponent,
    InitilizeLocalStorageComponent,
    PageNotFoundComponent,
    EbayPageNotFoundComponent,
    EbayNavBarComponent,
    AuctionTableComponent,
    
    // pipes
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
  entryComponents: [
  ],
  providers: [
    { // HTTP Interceptor set-up
    provide:HTTP_INTERCEPTORS,
    useClass:TokenInterceptorService,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }