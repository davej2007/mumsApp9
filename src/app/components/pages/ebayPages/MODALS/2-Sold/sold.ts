import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { AuctionService } from 'src/app/components/services/ebay/auction.service';
import { ConvertDate } from 'src/app/components/custom/directive/functions';

@Component({
  selector: 'sold-modal-content',
  templateUrl: `./sold.html`,
  styleUrls: ['../modal.css']
})

export class SoldModalContent implements OnInit {
  @Input() id:String;
  @Input() description:String;
  @Input() lastDateListed:number
  constructor(
    public activeModal: NgbActiveModal,
    private fb:FormBuilder,
    public _Auction:AuctionService) {}
  // form Get
  get dateSold()  { return this.SoldForm.get('dateSold');   }
  get private()   { return this.SoldForm.get('private');   }
  get auction()   { return this.SoldForm.get('auction');   }
  get price()     { return this.SoldForm.get('price');   }
  get userName()  { return this.SoldForm.get('userName');   }
  get postCode()  { return this.SoldForm.get('postCode');   }
  

    ngOnInit(){
      this.dateListed = ConvertDate(this.lastDateListed)
      this.dateSold.setValue(this.dateListed)
    }
    // Variables
    public errorMsg:String = '';
    public successMsg:String = '';
    public processing:Boolean = false;
    public dateListed : string;
    public dateMsg : string = null;
    public dateValid = false;

      // Form Definition
  SoldForm = this.fb.group({
    dateSold: ['', [Validators.required]],
    private : [false],
    auction:['', [Validators.required]],
    price:[null, [Validators.required]],
    userName:[null, [Validators.required]],
    postCode:null
  })
  disableForm(){    
    this.processing = true;
    this.dateSold.disable();
    this.private.disable();
    this.auction.disable();
    this.price.disable();
    this.userName.disable();
    this.postCode.disable();
  }
  enableForm(){
    this.processing = false;
    this.dateSold.enable();
    this.private.enable();
    this.auction.enable();
    this.price.enable();
    this.userName.enable();
    this.postCode.enable();    
  }
  checkDate(){
    let lastDateValue = Date.parse(new Date(this.lastDateListed).toDateString())
    let today = Date.parse(new Date().toDateString())
    let dateValue = Date.parse(new Date(this.dateSold.value).toDateString());
    if(lastDateValue<=dateValue && dateValue <= today){
      this.dateMsg = null;
      this.dateValid = true;
    } else {
      this.dateMsg = 'Invalid Date Entered';
      console.log('invalid date')
      this.dateValid = false;      
    }
  }
  submit(soldAuction){
    this.disableForm();
    soldAuction.auction +=' ';
    soldAuction.userName +=' ';
    soldAuction.postCode +=' ';
    
    let soldAuctionData = {
      id:this.id,
      dateSold:Date.parse(soldAuction.dateSold),
      private:soldAuction.private,
      auction:soldAuction.auction.trim(),
      price:soldAuction.price,
      postagePaid:soldAuction.postagePaid,
      userName:soldAuction.userName.trim(),
      postCode:soldAuction.postCode.trim().toUpperCase()
    }
    this._Auction.updateSoldAuction(soldAuctionData).subscribe(
      data => {
        if(!data.success){
          this.disableForm()
          this.errorMsg = data.message;
          setTimeout(()=>{
            this.errorMsg = '';
            this.enableForm();
          }, 2000);
        } else {
          this.successMsg='Auction Sold : '+data.auction.auction.description;
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