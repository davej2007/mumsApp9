import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuctionService } from '../service/auction.service';

@Injectable({
  providedIn: 'root'
})
export class AuctionUnDeliveredService implements Resolve<any> {
  
  constructor(
    public _auction:AuctionService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
  Observable<any> | Promise<any> | any{    
    return this._auction.getUnDeliveredAuctionDetails();
  }     
};
