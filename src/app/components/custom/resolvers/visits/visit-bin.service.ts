import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { VisitsService } from 'src/app/components/services/home/visits.service';

@Injectable({
  providedIn: 'root'
})
export class BinInfoService implements Resolve<any> {
  
  constructor(
    public _visit:VisitsService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
  Observable<any> | Promise<any> | any{    
    return this._visit.getBinDateDetails();
  }
        
};