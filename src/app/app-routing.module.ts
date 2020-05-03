import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './components/guards/auth.guard';
// General Pages
import { WelcomeToTheSiteComponent }        from './components/pages/generalPages/welcome-to-the-site/welcome-to-the-site.component';
import { WelcomeUnAuthorisedComponent }     from './components/pages/generalPages/welcome-un-authorised/welcome-un-authorised.component';
import { InitilizeLocalStorageComponent }   from './components/pages/generalPages/initilize-local-storage/initilize-local-storage.component';
import { PageNotFoundComponent }            from './components/pages/generalPages/page-not-found/page-not-found.component';
import { EbayNavBarComponent }              from './components/pages/ebayPages/0-ebay-nav-bar/ebay-nav-bar.component';
  import { AuctionTableComponent }          from './components/pages/ebayPages/1-auction-table/auction-table.component';
  import { SoldTableComponent }             from './components/pages/ebayPages/2-sold-table/sold-table.component';
  import { EbayFeesComponent }              from './components/pages/ebayPages/3-ebay-fees/ebay-fees.component';
  import { PayPalFeesComponent }            from './components/pages/ebayPages/4-pay-pal-fees/pay-pal-fees.component';
  import { ConfirmDeliveryComponent }       from './components/pages/ebayPages/5-confirm-delivery/confirm-delivery.component';
  import { MonthlyTotalsComponent }         from './components/pages/ebayPages/6-monthly-totals/monthly-totals.component';
  import { AuctionDetailsComponent }        from './components/pages/ebayPages/7-auction-details/auction-details.component';
  import { EditAuctionComponent }           from './components/pages/ebayPages/8-edit-auction/edit-auction.component';
  import { EbayPageNotFoundComponent }      from './components/pages/ebayPages/9-ebay-page-not-found/ebay-page-not-found.component';
import { AuctionInfoService } from './components/custom/resolvers/auction-info.service';
import { AuctionDetailService } from './components/custom/resolvers/auction-details.service';
import { AuctionUnDeliveredService } from './components/custom/resolvers/auction-un-delivered.service';
import { AuctionSoldService } from './components/custom/resolvers/auction-sold.service';

const routes: Routes = [
  { path:'',                      component   : WelcomeToTheSiteComponent,
                                  // canActivate : [AuthGuard],
                                  // data        : {role: [0,1,2,3,4]}
                                },

  { path:'welcomeFirstTimeUser',  component   : WelcomeUnAuthorisedComponent},
  { path:'initilizeUser',         component   : InitilizeLocalStorageComponent},
  // ebay Site
  { path:'ebaySite',                component   : EbayNavBarComponent, children: [
          { path : 'active',        component   : AuctionTableComponent,
                                    canActivate : [AuthGuard],
                                    data        : { role : [0,1], status: [1,0]  },
                                    resolve     : { info : AuctionInfoService }  },
          { path : 'sold',          component   : SoldTableComponent,
                                    canActivate : [AuthGuard],
                                    data        : {role : [1], status: [2,3,4,5]  },
                                    resolve     : { info : AuctionInfoService }  },
          { path : 'ebayFees',      component   : EbayFeesComponent,
                                    canActivate : [AuthGuard],
                                    data        : {role: [1]}},
          { path : 'paypalFees',    component   : PayPalFeesComponent,
                                    canActivate : [AuthGuard],
                                    data        : {role: [1]}},
          { path : 'confirmDel',    component   : ConfirmDeliveryComponent,
                                    canActivate : [AuthGuard],
                                    data        : { role: [1]},
                                    resolve     : { info : AuctionUnDeliveredService } },
          { path : 'detail/:id',    component   : AuctionDetailsComponent,
                                    canActivate : [AuthGuard],
                                    data        : {role : [1]},
                                    resolve     : {info : AuctionDetailService}},
          { path : 'edit/:id',      component   : EditAuctionComponent,
                                    canActivate : [AuthGuard],
                                    data        : {role: [1]},
                                    resolve     : {info : AuctionDetailService}},
          { path : 'monthlyTotals', component   : MonthlyTotalsComponent,
                                    canActivate : [AuthGuard],
                                    data        : {role: [0,1]},
                                    resolve     : {info : AuctionSoldService}},
          { path : '',              redirectTo  : '/ebaySite/active', pathMatch: 'full' },
          { path : '**',            component   : EbayPageNotFoundComponent}
  ]},
  // Home Site
  
  { path: '**',                   component   : PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
