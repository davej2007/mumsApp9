import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisitsService {

  constructor(public _HTTP:HttpClient) { }

  newVisit(visit:any){
    return this._HTTP.post<any>(environment.apiVisits+'/saveNewVisits', visit);
  }
  getVisitsDetails(){
    return this._HTTP.get<any>(environment.apiVisits+'/getVisitsInfo')
  }
}
