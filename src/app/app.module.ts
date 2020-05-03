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
// Ebay Pages
import { EbayNavBarComponent }            from './components/pages/ebayPages/0-ebay-nav-bar/ebay-nav-bar.component';
import { AuctionTableComponent }          from './components/pages/ebayPages/1-auction-table/auction-table.component';
import { SoldTableComponent }             from './components/pages/ebayPages/2-sold-table/sold-table.component';
import { EbayFeesComponent }              from './components/pages/ebayPages/3-ebay-fees/ebay-fees.component';
import { PayPalFeesComponent }            from './components/pages/ebayPages/4-pay-pal-fees/pay-pal-fees.component';
import { ConfirmDeliveryComponent }       from './components/pages/ebayPages/5-confirm-delivery/confirm-delivery.component';
import { MonthlyTotalsComponent }         from './components/pages/ebayPages/6-monthly-totals/monthly-totals.component';
import { AuctionDetailsComponent }        from './components/pages/ebayPages/7-auction-details/auction-details.component';
import { EditAuctionComponent }           from './components/pages/ebayPages/8-edit-auction/edit-auction.component';
import { EbayPageNotFoundComponent }      from './components/pages/ebayPages/9-ebay-page-not-found/ebay-page-not-found.component';
// Home Pages

// pipes
import { DecimalPipe }                    from '@angular/common';
import { DisplayPoundsPipe }              from './components/custom/pipe/display-pounds.pipe';
import { ChooseDatePipe }                 from './components/custom/pipe/choose-date.pipe';
import { DisplayWeightPipe }              from './components/custom/pipe/display-weight.pipe';
import { DisplayDatePipe }                from './components/custom/pipe/display-date.pipe';

// modals
import { NewAuctionModalContent }         from './components/pages/ebayPages/MODALS/0-NewAuction/newAuction';
import { UnSoldModalContent }             from './components/pages/ebayPages/MODALS/1-UnSold/unSold';
import { SoldModalContent }               from './components/pages/ebayPages/MODALS/2-Sold/sold';
import { PaidModalContent }               from './components/pages/ebayPages/MODALS/3-Paid/paid';
import { DeliveryModalContent }           from './components/pages/ebayPages/MODALS/5-Delivery/delivery';
import { PostModalContent }               from './components/pages/ebayPages/MODALS/4-Post/post';
import { DisplayTotalIncomePipe } from './components/custom/pipe/display-total-income.pipe';
import { DisplayFeesPipe } from './components/custom/pipe/display-fees.pipe';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeToTheSiteComponent,
    WelcomeUnAuthorisedComponent,
    InitilizeLocalStorageComponent,
    PageNotFoundComponent,
    EbayNavBarComponent,
      AuctionTableComponent,
      SoldTableComponent,
      EbayFeesComponent,
      PayPalFeesComponent,
      ConfirmDeliveryComponent,
      MonthlyTotalsComponent,    
      AuctionDetailsComponent,
      EditAuctionComponent,
      EbayPageNotFoundComponent,
    // pipes
    DisplayPoundsPipe,
    ChooseDatePipe,
    DisplayWeightPipe,
    DisplayDatePipe,
    // Modals
    NewAuctionModalContent,
    UnSoldModalContent,
    SoldModalContent,
    PaidModalContent,
    PostModalContent,
    DeliveryModalContent,
    DisplayTotalIncomePipe,
    DisplayFeesPipe
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
    NewAuctionModalContent,
    UnSoldModalContent,
    SoldModalContent,
    PaidModalContent,
    PostModalContent,
    DeliveryModalContent
  ],
  providers: [
    DecimalPipe,
    { // HTTP Interceptor set-up
    provide:HTTP_INTERCEPTORS,
    useClass:TokenInterceptorService,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }