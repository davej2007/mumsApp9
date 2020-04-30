import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public _HTTP:HttpClient) { }
// Decode Tokens
  decodeToken(){
    return this._HTTP.get<any>(environment.apiAuth +'/decodeToken');
  }
// Authenticate Log In
  authenticateEmployee_401(logIn:any){
    return this._HTTP.post<any>(environment.apiAuth+'/authenticateEmployee', logIn);
  }

  // Initilizing Local Variables
  initilizeLocalTokens(user:String){
    return this._HTTP.post<any>(environment.apiAuth+'/initilizeLocalTokens',{Initilize:user});
  }
}
