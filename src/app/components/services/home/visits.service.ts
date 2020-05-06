import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisitsService {
  // date    : req.body.date,
  // home    : { by      : req.body.person,
  //             checks  : { water   : req.body.water,
  //                         windows : req.body.windows,
  //                         doors   : req.body.doors },
  //             comments: req.body.comments },
  // agent   : { time    : req.body.time,
  //             name    : req.body.name,
  //             feedback: req.body.feedback},
  // bins    : { type    : req.body.bins}
  constructor(public _HTTP:HttpClient) { }

  newVisit(visit:any){
    return this._HTTP.post<any>(environment.apiVisits+'/saveNewVisits', visit);
  }
  getVisitsDetails(){
    return this._HTTP.get<any>(environment.apiVisits+'/getVisitsInfo')
  }
}
