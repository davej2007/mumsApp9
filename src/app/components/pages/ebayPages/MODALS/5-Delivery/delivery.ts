import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { AuctionService } from 'src/app/components/services/ebay/auction.service';
import { ConvertDate } from 'src/app/components/custom/directive/functions';

@Component({
  selector: 'delivery-modal-content',
  templateUrl: `./delivery.html`,
  styleUrls: ['../modal.css']
})
export class DeliveryModalContent implements OnInit {
  @Input() id:String;
  @Input() description:String;
  @Input() company:String;
  @Input() trackingNo:String;
  @Input() dateSold:number;

  constructor(
    public activeModal: NgbActiveModal,
    private fb:FormBuilder,
    public _Auction:AuctionService) {}
  // form Get
  get date()  { return this.DeliveredForm.get('date');   }

  ngOnInit(){
    this.dateItemSold = ConvertDate(this.dateSold)
      this.date.setValue(this.dateItemSold)
  }
  // Variables
  public errorMsg:String = '';
  public successMsg:String = '';
  public processing:Boolean = false;
  public dateItemSold : string;
  public dateMsg : string = null;
  public dateValid = false;

  // Form Definition
  DeliveredForm = this.fb.group({
    date:['', [Validators.required]]
  })
  disableForm(){    
    this.processing = true;
    this.date.disable();
  }
  enableForm(){
    this.processing = false;
    this.date.enable();
  }
  checkDate(){
    let lastDateValue = Date.parse(new Date(this.dateItemSold).toDateString())
    let today = Date.parse(new Date().toDateString())
    let dateValue = Date.parse(new Date(this.date.value).toDateString());
    if(lastDateValue<=dateValue && dateValue <= today){
      this.dateMsg = null;
      this.dateValid = true;
    } else {
      this.dateMsg = 'Invalid Date Entered';
      this.dateValid = false;      
    }
  }
  submit(DeliveryDetails:any){
    this.disableForm();
    let deliveryData = {
      id : this.id,
      date:Date.parse(DeliveryDetails.date)
    }
    this._Auction.updateDeliveredAuction(deliveryData).subscribe(
      data => {
        if(!data.success){
          this.disableForm()
          this.errorMsg = data.message;
          setTimeout(()=>{
            this.errorMsg = '';
            this.enableForm();
          }, 2000);
        } else {
          this.successMsg='Auction Updated : '+data.auction.auction.description;
          setTimeout(()=>{
            this.successMsg = '';
            this.activeModal.close(data);
          }, 2000);
        }
      },
      err => {
        alert('Server Error : '+err.message+' If this continues Please contact Systems.');
        this.enableForm();
      }
    )
  }
}