import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { DateValue, ConvertDate, aWeekIs } from 'src/app/components/custom/directive/functions';
import { AUTHService } from 'src/app/components/AUTH-Modules/AUTH.service';
import { VisitsService } from 'src/app/components/services/home/visits.service';

@Component({
  selector: 'estate-visit-modal-content',
  templateUrl: `./estate-visit.html`,
  styleUrls: ['../modal.css']
})
export class EstateVisitModalContent implements OnInit {
  @Input() id:String;
  @Input() estate:String;
  constructor(
    public activeModal: NgbActiveModal,
    private fb:FormBuilder,
    public _AUTH:AUTHService,
    public _Visits:VisitsService) {}
  
  // form Get
  get date()  { return this.EstateForm.get('date');   }
  get time()  { return this.EstateForm.get('time');   }
  get name()  { return this.EstateForm.get('name');   }
  get feedback()  { return this.EstateForm.get('feedback');   }

  ngOnInit(): void {
    let date:Date = new Date();
    let currentDay:number = date.getDate()
    let currentmonth:number = date.getMonth();
    let currentyear:number = date.getUTCFullYear();
    this.TODAY = DateValue(new Date(currentyear, currentmonth, currentDay, 23, 59, 59));
    if (this.id == null){
      this.date.setValue(ConvertDate(this.TODAY))
    } else {
      this._Visits.getVisitById(this.id).subscribe(
        res=>{
          if(!res.success){
            this.errorMsg = res.message
          } else {
            this.date.setValue(ConvertDate(res.visit.date))
            this.time.setValue(res.visit.agent.time)
            if(res.visit.agent.name!='n/a') this.name.setValue(res.visit.agent.name)
            if(res.visit.agent.feedback!='n/a') this.feedback.setValue(res.visit.agent.feedback)
          }
        }
      )
    }
  }
  // Variables
    public errorMsg       : String = '';
    public successMsg     : String = '';
    public processing     : Boolean = false;
    public TODAY          : number;
    public dateValid      : Boolean = true;
    public dateMsg        : String ='';
  // Form Definition
  EstateForm = this.fb.group({
    date: [null, [Validators.required]],
    time: [null, [Validators.required]],
    name : ['', [Validators.required]],    
    feedback:null
  })
  disableForm(){
    this.processing = true;
    this.date.disable();
    this.time.disable();
    this.name.disable();
    this.feedback.disable();
  }
  enableForm(){
    this.date.enable();
    this.time.enable();
    this.name.enable();
    this.feedback.enable();
    this.processing = false;
  }
  clearForm(){
    this.EstateForm.reset();
  };
  checkDate(date:string){
    let st = DateValue(new Date(2019, 10, 1));
    let d = Date.parse(date);
    if (st<=d && d<this.TODAY + aWeekIs * 4) {
      this.dateValid = true;
      this.dateMsg = 'Date Ok.'
    } else {
      this.dateValid = false;
      this.dateMsg = 'Max 4 Weeks In Future'
    }
  }
  submit(form:any){
    this.disableForm();
    let newAgent = {
      date:DateValue(form.date),
      type:2,
      time:form.time,
      name:form.name,
      feedback:form.feedback      
    }
    this._Visits.newVisit(newAgent).subscribe(
      data => {
        if(!data.success){            
          this.errorMsg = data.message;
          setTimeout(()=>{
            this.errorMsg = '';
            this.enableForm()
          }, 2000);
        } else {
          this.successMsg='Estate Agent Appointment Created: ';
          setTimeout(()=>{
            this.successMsg = '';
            this.activeModal.close(data);
          }, 2000);
        }
      },
      err => {
        alert('Server Error : '+err.message+' If this continues Please contact Systems.');
        this.enableForm()
      }
    )
  }
  update(form:any){
    this.disableForm();
    let updateVisit = {
      date:DateValue(form.date),
      type:2,
      time:form.time,
      name:form.name,
      feedback:form.feedback
    }
    this._Visits.updateVisitById(this.id, updateVisit).subscribe(
      data => {
        if(!data.success){            
          this.errorMsg = data.message;
          setTimeout(()=>{
            this.errorMsg = '';
            this.enableForm()
          }, 2000);
        } else {
          this.successMsg='Visit Updated: ';
          setTimeout(()=>{
            this.successMsg = '';
            this.activeModal.close(data);
          }, 2000);
        }
      },
      err => {
        alert('Server Error : '+err.message+' If this continues Please contact Systems.');
        this.enableForm()
      }
    )
  }
  delete(){
    this.disableForm();
    this._Visits.deleteVisitById(this.id).subscribe(
      data => {
        if(!data.success){            
          this.errorMsg = data.message;
          setTimeout(()=>{
            this.errorMsg = '';
            this.enableForm()
          }, 2000);
        } else {
          this.successMsg='Agent Visit Deleted: ';
          setTimeout(()=>{
            this.successMsg = '';
            this.activeModal.close(data);
          }, 2000);
        }
      },
      err => {
        alert('Server Error : '+err.message+' If this continues Please contact Systems.');
        this.enableForm()
      }
    )
  }
}