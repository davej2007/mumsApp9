import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VisitsService } from 'src/app/components/services/home/visits.service';
import { IVISIT } from 'src/app/components/custom/interface/visit';

@Component({
  selector: 'calender-details-modal-content',
  templateUrl: `./calender-details.html`,
  styleUrls: ['../modal.css']
})
export class CalenderDetailsModalContent implements OnInit {

  @Input() date:number;
  @Input() entries:Array<String>;

  constructor(
    public activeModal: NgbActiveModal,
    public _Visits:VisitsService) {}
  
  ngOnInit(): void {
    this._Visits.getVisitsDetails().subscribe(
      res=>{
        if(!res.success){
          this.errorMsg = res.message
        } else {
          this.EntryList = [];
          this.entries.map(e => {
            let x = res.visits.findIndex((i:any)=> i._id === e)
            if(x!=-1) this.EntryList.push(res.visits[x])
          })
        }
      }
    )
  }
  // Variables
    public errorMsg       : String = '';
    public EntryList      : Array<IVISIT>
}