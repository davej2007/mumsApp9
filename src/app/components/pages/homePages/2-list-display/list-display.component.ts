import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { VisitTableControlService } from 'src/app/components/services/home/table-control-info.service';
import { VisitsService } from 'src/app/components/services/home/visits.service';
import { AUTHService } from 'src/app/components/AUTH-Modules/AUTH.service';
import { Months } from 'src/app/components/custom/directive/functions';

import { IVISIT } from 'src/app/components/custom/interface/visit';
import { IDISPLAYDATE } from 'src/app/components/custom/interface/state';
import { HomeVisitModalContent } from '../MODALS/1-home-visit/home-visit';
import { EstateVisitModalContent } from '../MODALS/2-estate-visit/estate-visit';

@Component({
  selector: 'list-display',
  templateUrl: './list-display.component.html',
  styleUrls: ['./list-display.component.css']
})
export class ListDisplayComponent implements OnInit {
  
  Visits$: Observable<IVISIT[]>;
  total$: Observable<number>;
  
  public MONTHS       : Array<string> = Months  
  public DisplayShow  : Array<IDISPLAYDATE>= [];
  
  constructor(
    public  tableService: VisitTableControlService,
    private activatedRoute:ActivatedRoute,
    public modalService: NgbModal,
    public _visit:VisitsService,
    public _Router:Router,
    public _AUTH:AUTHService
    ) {
      this.Visits$ = tableService.visits$;
      this.total$ = tableService.total$;
    }
  
  ngOnInit(){
    let date:Date = new Date();
    let currentmonth:number = date.getMonth();
    let currentyear:number = date.getUTCFullYear();
    this.tableService.displayDate = {month:currentmonth,year:currentyear}
    let y:number= 2019;
    let m:number = 10;
    while ( currentyear>y || currentmonth>=m ) {
      this.DisplayShow.push({month:m,year:y});
      if(m==11){
        m=0;y++
      } else {
        m++
      }
    }
    this.activatedRoute.data.subscribe(
      data=>{
        if(data.info.success){
          this.tableService.VISITS = data.info.visits;
        } else {
          alert(data.message)
        }
      },
      err =>  {
        alert('Server Error : '+err.message+' If this continues Please contact Systems.');
      }
    )
  }
  checkDisplayDate(en:any){
    if(this.tableService.displayDate.month == en.month && this.tableService.displayDate.year == en.year){
      return true
    } else {
      return false
    }
  }
  getCustomCss(type:number){
    if (type==1) return 'home'
    if (type==2) return 'agent'
    return 'bins'
  }
  openNewHouseVisit(){
    const modalRef = this.modalService.open(HomeVisitModalContent, {backdrop:'static', size:'lg'});
    modalRef.result.then(
      res => {
        if(res.success){
          this.reloadTableData()
        } else {
          console.log('Error from Modal : ', res)
        }
      },
      reason => { console.log('New House Visit Cancelled.') }
    );
  }
  openNewEstateVisit(){
    const modalRef = this.modalService.open(EstateVisitModalContent, {backdrop:'static', size:'lg'});
     modalRef.result.then(
      res => {
        if(res.success){
          this.reloadTableData()
        } else {
          console.log('Error from Modal : ', res)
        }
      },
      reason => { console.log('New Estate Visit Cancelled.') }
    );
  }
  reloadTableData(){
    let old:IDISPLAYDATE = this.tableService.displayDate;
    this._visit.getVisitsDetails().subscribe(
      data=>{
        if(data.success){
          this.tableService.displayDate = { month:0, year:2018 }
          this.tableService.VISITS = data.visits;
          this.tableService.displayDate = old;
        } else {
          console.log(data.message)
        }
      },
      err=>{console.log(err)}
      )
  }
}
