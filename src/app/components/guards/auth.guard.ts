import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AUTHService } from '../AUTH-Modules/AUTH.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  
  constructor(
    private _AUTH:AUTHService,
    private _Router:Router){ }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let x = next.data.role;
    if(this._AUTH.adminRights(x)){
      return true;
    } else {
      this._Router.navigate(['/welcomeFirstTimeUser']);
      return false;
    }
  }
}