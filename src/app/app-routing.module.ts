import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './components/guards/auth.guard';
// General Pages
import { WelcomeToTheSiteComponent }        from './components/pages/generalPages/welcome-to-the-site/welcome-to-the-site.component';
import { WelcomeUnAuthorisedComponent }     from './components/pages/generalPages/welcome-un-authorised/welcome-un-authorised.component';
import { InitilizeLocalStorageComponent }   from './components/pages/generalPages/initilize-local-storage/initilize-local-storage.component';
import { PageNotFoundComponent }            from './components/pages/generalPages/page-not-found/page-not-found.component';
import { EbayNavBarComponent } from './components/pages/ebayPages/ebay-nav-bar/ebay-nav-bar.component';

const routes: Routes = [
  { path:'',                      component   : WelcomeToTheSiteComponent,
                                  canActivate : [AuthGuard],
                                  data        : {role: [0,1,2,3,4]}},
  { path:'welcomeFirstTimeUser',  component   : WelcomeUnAuthorisedComponent},
  { path:'initilizeUser',         component   : InitilizeLocalStorageComponent},
  // ebay Site
  { path:'ebaySite',              component   : EbayNavBarComponent},
  // Home Site
  
  { path: '**',                   component   : PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
