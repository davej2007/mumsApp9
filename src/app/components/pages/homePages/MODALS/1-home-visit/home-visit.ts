import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { DateValue, ConvertDate, aDayIs } from 'src/app/components/custom/directive/functions';
import { AUTHService } from 'src/app/components/AUTH-Modules/AUTH.service';
import { VisitsService } from 'src/app/components/services/home/visits.service';

@Component({
  selector: 'home-visit-modal-content',
  templateUrl: `./home-visit.html`,
  styleUrls: ['../modal.css']
})
export class HomeVisitModalContent implements OnInit {
  @Input() id:String;
  @Input() home:String;
  constructor(
    public activeModal: NgbActiveModal,
    private fb:FormBuilder,
    public _AUTH:AUTHService,
    public _Visits:VisitsService) {}
  // form Get
  get date()  { return this.VisitForm.get('date');   }
  get person()  { return this.VisitForm.get('person');   }
  get water()  { return this.VisitForm.get('water');   }
  get doors()  { return this.VisitForm.get('doors');   }
  get windows()  { return this.VisitForm.get('windows');   }
  get comments()  { return this.VisitForm.get('comments');   }

  ngOnInit(): void {
    let date:Date = new Date();
    let currentDay:number = date.getDate()
    let currentmonth:number = date.getMonth();
    let currentyear:number = date.getUTCFullYear();
    this.TODAY = DateValue(new Date(currentyear, currentmonth, currentDay, 23, 59, 59));
    if (this.id == null){
      this.date.setValue(ConvertDate(this.TODAY))
      this.person.setValue(this._AUTH.UserName)
    } else {
      this._Visits.getVisitById(this.id).subscribe(
        res=>{
          if(!res.success){
            this.errorMsg = res.message
          } else {
            this.date.setValue(ConvertDate(res.visit.date))
            this.person.setValue(res.visit.home.by)
            if (res.visit.home.checks.water) this.water.setValue('Yes')
            if (res.visit.home.checks.doors) this.doors.setValue('Yes')
            if (res.visit.home.checks.windows) this.windows.setValue('Yes')
            if (res.visit.home.comments != 'n/a') this.comments.setValue(res.visit.home.comments)
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
  VisitForm = this.fb.group({
    date      : [null, [Validators.required]],
    person    : ['', [Validators.required]],
    water     : ['No', [Validators.required]],
    doors     : ['No', [Validators.required]],
    windows   : ['No', [Validators.required]],
    comments  : null
  })
  disableForm(){
    this.processing = true;
    this.date.disable();
    this.person.disable();
    this.water.disable();
    this.doors.disable();
    this.windows.disable();
    this.comments.disable();
  }
  enableForm(){
    this.date.enable();
    this.person.enable();
    this.water.enable();
    this.doors.enable();
    this.windows.enable();
    this.comments.enable();
    this.processing = false;
  }
  clearForm(){
    this.VisitForm.reset();
    this.date.setValue(ConvertDate(this.TODAY))
    this.person.setValue(this._AUTH.UserName)
    this.doors.setValue('No')
    this.windows.setValue('No')
    this.water.setValue('No')
  };
  checkDate(date:string){
    let st = DateValue(new Date(2019, 10, 1));
    let d = Date.parse(date);
    if (st<=d && d<this.TODAY + aDayIs) {
      this.dateValid = true;
      this.dateMsg = 'Date Ok.'
    } else {
      this.dateValid = false;
      this.dateMsg = 'Invalid Date'
    }
  }
  submit(form){
    this.disableForm();
    let newVisit = {
      date:DateValue(form.date),
      type:1,
      person:form.person,
      water:form.water == 'Yes',
      windows:form.windows == 'Yes',
      doors:form.doors == 'Yes',
      comments:form.comments
    }
    this._Visits.newVisit(newVisit).subscribe(
      data => {
        if(!data.success){            
          this.errorMsg = data.message;
          setTimeout(()=>{
            this.errorMsg = '';
            this.enableForm()
          }, 2000);
        } else {
          this.successMsg='Visit Created: ';
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
  update(form){
    this.disableForm();
    let updateVisit = {
      date:DateValue(form.date),
      type:1,
      person:form.person,
      water:form.water == 'Yes',
      windows:form.windows == 'Yes',
      doors:form.doors == 'Yes',
      comments:form.comments
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
          this.successMsg='Visit Deleted: ';
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