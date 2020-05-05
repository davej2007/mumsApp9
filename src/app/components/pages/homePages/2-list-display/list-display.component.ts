import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { VisitTableControlService } from 'src/app/components/services/home/table-control-info.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VisitsService } from 'src/app/components/services/home/visits.service';
import { AUTHService } from 'src/app/components/AUTH-Modules/AUTH.service';
import { IVISIT } from 'src/app/components/custom/interface/visit';

@Component({
  selector: 'list-display',
  templateUrl: './list-display.component.html',
  styleUrls: ['./list-display.component.css']
})
export class ListDisplayComponent implements OnInit {
  
  Visits$: Observable<IVISIT[]>;
  total$: Observable<number>;
  
  constructor(
    public  tableService: VisitTableControlService,
    private activatedRoute:ActivatedRoute,
    public _visit:VisitsService,
    public _Router:Router,
    public _AUTH:AUTHService
    ) {
      this.Visits$ = tableService.visits$;
      this.total$ = tableService.total$;
    }

  ngOnInit(){
    this.activatedRoute.data.subscribe(
      data=>{
        if(data.info.success){
          console.log(data.info)
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

}
