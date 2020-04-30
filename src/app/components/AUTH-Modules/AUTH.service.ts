import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AUTHService {

  // Authentication Variables
  public Token : String;
  public UserName : String = null;
  public admin : String = '0';
  
  constructor(
    public _Auth:AuthService
  ) { }

initilizeSettings(): Promise<any> {
    if(this.Token ==='false' || this.Token===null || this.Token===undefined) this.Token = localStorage.getItem('Token') || 'false';

    const AuthPromise = this._Auth.decodeToken()
    .toPromise()
    .then(
        token => {
            if(!token.success){
                alert('No Valid Token Found')
            } else {
                alert('Valid Token ');
                console.log(token);
            }
        },
        err =>  {
            alert('Server Error : '+err.message+' If this continues Please contact Systems.');
        })
return AuthPromise;
}


  UserLoggedIn(){
    if(this.UserName==null){
      return false
    } else {
      return true
    }
  }
  adminRights(e:any){
    if(!!this.admin){
      for (var i = 0; i <= e.length; i++) {
        if (i==e.length){
          return false;
        } else {
          if(this.admin[e[i]]=='1') return true;
        }
      }
    }
    return false;
  }
  storeLocalVariables(token:string){
    if (token) {
      localStorage.setItem('Token', token);
      this.Token = token;
    }
    this.initilizeSettings();
  }
  doLogOut(){
      localStorage.removeItem('Token');
      this.Token = 'false';
      this.initilizeSettings();
  };
}