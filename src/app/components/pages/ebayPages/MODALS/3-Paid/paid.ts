import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormBuilder } from '@angular/forms';
import { AuctionService } from 'src/app/components/services/ebay/auction.service';

@Component({
  selector: 'paid-modal-content',
  templateUrl: `./paid.html`,
  styleUrls: ['../modal.css']
})
export class PaidModalContent implements OnInit {
  @Input() id:String;
  @Input() description:String;
  @Input() buyerName:String;
  @Input() buyerPostCode:String;

  constructor(
    public activeModal: NgbActiveModal,
    private fb:FormBuilder,
    public _Auction:AuctionService) {}
  // form Get
  get paidBy()  { return this.PaidForm.get('paidBy');   }
  get paypalTransaction()   { return this.PaidForm.get('paypalTransaction');   }
  get company()  { return this.PaidForm.get('company');   }  
  get postage()  { return this.PaidForm.get('postage');   }  
  get name()  { return this.PaidForm.get('name');   }  
  get postCode()  { return this.PaidForm.get('postCode');   }  
  
    ngOnInit(){
      this.name.setValue(this.buyerName);
      this.postCode.setValue(this.buyerPostCode)
    }
    // Variables
    public errorMsg:String = '';
    public successMsg:String = '';
    public processing:Boolean = false;

      // Form Definition
  PaidForm = this.fb.group({
    paidBy            : ['', [Validators.required]],
    paypalTransaction : [ null ],
    company           : [ null ],
    postage           : [ null ],
    name              : [ null ],
    postCode          : [ null ]
  })
  disableForm(){    
    this.processing = true;
    this.paidBy.disable();
    this.paypalTransaction.disable();
    this.postage.disable();
    this.company.disable();
    this.name.disable();
    this.postCode.disable();
  }
  enableForm(){
    this.processing = false;
    this.paidBy.enable();
    this.paypalTransaction.enable();
    this.postage.enable();
    this.company.enable();
    this.name.enable();
    this.postCode.enable();
  }
  submit(paidDetails:any){
    this.disableForm();
    if(paidDetails.paypalTransaction == null) paidDetails.paypalTransaction=' ';
    if(paidDetails.name == null) paidDetails.name=' ';
    if(paidDetails.postCode == null) paidDetails.postCode=' ';
    let paidAuctionData = {
      id : this.id,
      paidBy : paidDetails.paidBy,
      paypalTransaction : paidDetails.paypalTransaction.trim(),
      company: paidDetails.company,
      postagePaid : paidDetails.postage,
      buyerName : paidDetails.name.trim(),
      buyerPostCode : paidDetails.postCode.trim().toUpperCase()
    }
    this._Auction.updatePaidAuction(paidAuctionData).subscribe(
      data => {
        if(!data.success){
          this.disableForm()
          this.errorMsg = data.message;
          setTimeout(()=>{
            this.errorMsg = '';
            this.enableForm();
          }, 2000);
        } else {
          this.successMsg='Auction Paid : '+data.auction.auction.description;
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