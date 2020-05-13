import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IVISIT } from 'src/app/components/custom/interface/visit';
import { DateValue, ConvertDate, aWeekIs } from 'src/app/components/custom/directive/functions';
import { VisitsService } from 'src/app/components/services/home/visits.service';
import { Observable } from 'rxjs';
import { BinTableControlService } from 'src/app/components/services/home/table-control-bin.service';
import { IDISPLAYDATE } from 'src/app/components/custom/interface/state';

@Component({
  selector: 'update-bin-dates',
  templateUrl: './update-bin-dates.component.html',
  styleUrls: ['./update-bin-dates.component.css']
})
export class UpdateBinDatesComponent implements OnInit {
  
  Visits$: Observable<IVISIT[]>;
  total$: Observable<number>;
  public dateInput : string
  public lastDateInput : number;
  
  constructor(
    public  tableService: BinTableControlService,
    private activatedRoute:ActivatedRoute,
    // public modalService: NgbModal,
    public _visit:VisitsService,
    public _Router:Router,
    // public _AUTH:AUTHService
    ) {
      this.Visits$ = tableService.visits$;
      this.total$ = tableService.total$;
    }
  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
      data=>{
        if(data.info.success){
          this.tableService.VISITS = data.info.visits;
          this.lastDateInput = this.tableService.VISITS[this.tableService.VISITS.length-1].date
          this.dateInput=ConvertDate(this.lastDateInput);
        } else {
          alert(data.message)
        }
      },
      err =>  {
        alert('Server Error : '+err.message+' If this continues Please contact Systems.');
      }
    )
  }
  addAWeek(){
    console.log(this.lastDateInput)
    this.dateInput=ConvertDate(this.lastDateInput+ aWeekIs);
  }

  submitRecycle(date:String){
    this.createNewBinDay({
      date:DateValue(date),
      type:3,
      bins:'Recycling',
      binsUsed : true
    })
  }
  submitBins(date:String){
    this.createNewBinDay({
      date:DateValue(date),
      type:3,
      bins:'Black Bins & Recycling',
      binsUsed : true
    })
  }
  createNewBinDay(data:any){
    this._visit.newVisit(data).subscribe(
      res => {
        if(res.success){
          this.reloadTableData()
        } else {
          console.log('Success False : ', res)
        }
      },
      err=>{console.log(err)}
    )
  }
  reloadTableData(){
    let old:IDISPLAYDATE = this.tableService.displayDate;
    this._visit.getBinDateDetails().subscribe(
      data=>{
        if(data.success){
          this.tableService.displayDate = { month:0, year:2018 }
          this.tableService.VISITS = data.visits;
          this.tableService.displayDate = old;
          this.lastDateInput = this.tableService.VISITS[this.tableService.VISITS.length-1].date
          this.dateInput=ConvertDate(this.lastDateInput);
        } else {
          console.log(data.message)
        }
      },
      err=>{console.log(err)}
      )
  }
}
