import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeToTheSiteComponent }        from './components/pages/generalPages/welcome-to-the-site/welcome-to-the-site.component';
import { WelcomeUnAuthorisedComponent }     from './components/pages/generalPages/welcome-un-authorised/welcome-un-authorised.component';
import { InitilizeLocalStorageComponent }   from './components/pages/generalPages/initilize-local-storage/initilize-local-storage.component';
import { PageNotFoundComponent }            from './components/pages/generalPages/page-not-found/page-not-found.component';
import { EbayNavBarComponent }              from './components/pages/ebay/nav-bar/nav-bar.component';
import { AuctionsComponent }                from './components/pages/ebay/auctions/auctions.component';
import { SoldComponent }                    from './components/pages/ebay/sold/sold.component';
import { EbayPageNotFoundComponent }        from './components/pages/ebay/page-not-found/page-not-found.component';
import { HomeNavBarComponent }              from './components/pages/home/nav-bar/nav-bar.component';
import { CalenderComponent }                from './components/pages/home/calender/calender.component';
import { HomePageNotFoundComponent }        from './components/pages/home/page-not-found/page-not-found.component';
import { AuthGuard } from './components/guards/auth.guard';


const routes: Routes = [
  {path:'', component: WelcomeToTheSiteComponent, canActivate:[AuthGuard], data: {role: [0,1,2,3,4]}},
  {path:'welcomeFirstTimeUser', component : WelcomeUnAuthorisedComponent},
  {path:'initilizeUser', component:InitilizeLocalStorageComponent},
  {path:'ebaySite', component:EbayNavBarComponent, canActivate:[AuthGuard], data: {role: [0,1]},
  children: [
    { path: 'active', component: AuctionsComponent },
    { path: 'sold', component: SoldComponent },
    { path: '**', component: EbayPageNotFoundComponent }
  ]},
  {path:'homeSite', component:HomeNavBarComponent, canActivate:[AuthGuard], data: {role: [2,3,4]},children: [
    { path: 'calender', component: CalenderComponent },
    { path: '**', component: HomePageNotFoundComponent }
  ]},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
