import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuctionService } from 'src/app/components/services/ebay/auction.service';

export interface IFEESINPUT {
  _id           : string,    
  placeInArray  : number,
  ebayAuctionNo : string,
  paypalSet   : boolean,
  paypalFee : number,
  description   : string,
  buyerName     : string,
  buyerUserName : string,
  soldFor       : number,
  paidPostage   : number,
  uploaded      : boolean,
  error         : boolean
}
@Component({
  selector: 'pay-pal-fees',
  templateUrl: './pay-pal-fees.component.html',
  styleUrls: ['./pay-pal-fees.component.css']
})
export class PayPalFeesComponent implements OnInit {
  
  constructor(
    private fb:FormBuilder,
    public _auction:AuctionService
    ) { }
    
  // Form Gets
  get _id()           { return this.FeeForm.get('_id');           }    
  get placeInArray()  { return this.FeeForm.get('placeInArray');  }
  get ebayAuctionNo() { return this.FeeForm.get('ebayAuctionNo'); }
  get paypalSet()     { return this.FeeForm.get('paypalSet');   }
  get paypalFee()     { return this.FeeForm.get('paypalFee'); }
  get description()   { return this.FeeForm.get('description');   }
  get buyerName()     { return this.FeeForm.get('buyerName');     }
  get buyerUserName() { return this.FeeForm.get('buyerUserName'); }
  get soldFor()       { return this.FeeForm.get('soldFor'); }
  get paidPostage()   { return this.FeeForm.get('paidPostage'); }

  ngOnInit(): void {
  }
  // Variables
  public errorMsg         : String = '';
  public successMsg       : String = '';
  public processing       : Boolean = false;
  public ebayAuctionValid : Boolean = false;
  public ebayAuctionError : string = '';
  public PayPalFeeList    : Array<IFEESINPUT> = [];
  public hasErrors        : Boolean = false;
  public uploadComplete   : Boolean = false;

  FeeForm = this.fb.group({
    _id               : [ null ],    
    placeInArray      : [ undefined ],
    ebayAuctionNo     : ['', [Validators.required]],
    paypalSet         : [ null ],
    paypalFee         : [ null ],
    description       : [ null ],
    buyerName         : [ null ],
    buyerUserName     : [ null ],
    soldFor           : [ null ],
    paidPostage       : [ null ]
  })
  disableForm(){
    this.processing =true;
    this.ebayAuctionNo.disabled;
    this.paypalFee.disabled;
    this.paypalSet.disabled;
  }
  enableForm(){
    this.processing = false;
    this.ebayAuctionNo.enabled;
    this.paypalFee.enabled;
    this.paypalSet.enabled;
  }
  
  findEbayAuction(){
    let index : number = this.PayPalFeeList.findIndex((i: any ) => i.ebayAuctionNo === this.ebayAuctionNo.value)
    if(index!==-1){
      this._id.setValue(this.PayPalFeeList[index]._id);    
      this.placeInArray.setValue(index)
      this.paypalSet.setValue(this.PayPalFeeList[index].paypalSet);
      this.paypalFee.setValue(this.PayPalFeeList[index].paypalFee / 100);
      this.description.setValue(this.PayPalFeeList[index].description);
      this.buyerName.setValue(this.PayPalFeeList[index].buyerName);
      this.buyerUserName.setValue(this.PayPalFeeList[index].buyerUserName);      
      this.soldFor.setValue(this.PayPalFeeList[index].soldFor);
      this.paidPostage.setValue(this.PayPalFeeList[index].paidPostage);
      this.ebayAuctionValid = true;
      this.ebayAuctionError = '';
    } else {
      this._auction.findEbayAuctionNumber(this.ebayAuctionNo.value).subscribe(
        data=>{
          if(data.success){
            console.log(data.auction)
            this._id.setValue(data.auction._id);
            this.placeInArray.setValue(undefined)
            this.paypalSet.setValue(data.auction.fee.paypalFee.set);
            this.paypalFee.setValue(data.auction.fee.paypalFee.cost / 100);
            this.description.setValue(data.auction.auction.description);
            this.buyerName.setValue(data.auction.sold.buyer.name);
            this.buyerUserName.setValue(data.auction.sold.buyer.userName);
            this.soldFor.setValue(data.auction.sold.price);
            this.paidPostage.setValue(data.auction.paid.postage);                
            this.ebayAuctionValid = true;
            this.ebayAuctionError = '';
          } else {
            this._auction.findPaypalTransactionNumber(this.ebayAuctionNo.value).subscribe(
              data=>{
                if(data.success){
                  console.log(data.auction)
                  this._id.setValue(data.auction._id);
                  this.placeInArray.setValue(undefined)
                  this.paypalSet.setValue(data.auction.fee.paypalFee.set);
                  this.paypalFee.setValue(data.auction.fee.paypalFee.cost / 100);
                  this.description.setValue(data.auction.auction.description);
                  this.buyerName.setValue(data.auction.sold.buyer.name);
                  this.buyerUserName.setValue(data.auction.sold.buyer.userName);
                  this.soldFor.setValue(data.auction.sold.price);
                  this.paidPostage.setValue(data.auction.paid.postage);
                  this.ebayAuctionValid = true;
                  this.ebayAuctionError = '';
                } else {
                  this._id.setValue(null);
                  this.placeInArray.setValue(undefined)
                  this.paypalSet.setValue(null);
                  this.paypalFee.setValue(null);
                  this.description.setValue(null);
                  this.buyerName.setValue(null);
                  this.buyerUserName.setValue(null);
                  this.soldFor.setValue(null);
                  this.paidPostage.setValue(null);                
                  this.ebayAuctionValid = false;
                  this.ebayAuctionError = data.message;                  
                }
              },
              err =>  {
                alert('Server Error : '+err.message+' If this continues Please contact Systems.');
              }
            )}
          },
        err =>  {
          alert('Server Error : '+err.message+' If this continues Please contact Systems.');
        }
      )
    }
  }
  submit(feeData:IFEESINPUT){
    this.disableForm()
    feeData.paypalFee = Math.round(feeData.paypalFee*100);
    if(feeData.placeInArray !== undefined){
      this.PayPalFeeList[feeData.placeInArray].paypalFee = feeData.paypalFee;
      this.PayPalFeeList[feeData.placeInArray].paypalSet = feeData.paypalSet;
      this.successMsg = 'Updated Fees List';
      setTimeout(()=>{
        this.successMsg = '';
        this.FeeForm.reset();
        this.ebayAuctionValid = true;
        this.ebayAuctionError = '';
        this.enableForm();
      }, 2000);
    } else {
      feeData.uploaded = false;
      feeData.error = false;
      this.PayPalFeeList.push(feeData);
      this.successMsg = 'New Fees Added To List';
      setTimeout(()=>{
        this.successMsg = '';
        this.FeeForm.reset();
        this.ebayAuctionValid = true;
        this.ebayAuctionError = '';
        this.enableForm();
      }, 2000);
    }
  }
  update(){
    this.PayPalFeeList.forEach(entry => {
      let data = { id:entry._id,
        finalFee: {cost:undefined, promo:undefined, set:undefined, completed:undefined},
        postageFee : {cost:undefined, set:undefined, completed:undefined},
        paypalFee: {cost:entry.paypalFee, set:entry.paypalSet, completed:true }}
      console.log(data);  
      this._auction.updateFeesAuction(data).subscribe(
        data=>{
          if(data.success){
            entry.uploaded = true;
            entry.error = false;
          } else {
            entry.uploaded = false;
            entry.error = true;
            this.hasErrors = true;
          }
        },
        err =>  {
          alert('Server Error : '+err.message+' If this continues Please contact Systems.');
        }
      )
    });
    this.uploadComplete = true;
  }
  complete(){
    let i :number =0;
    do {
      if(this.PayPalFeeList[i].uploaded){
        this.PayPalFeeList.splice(i, 1)
      } else {
        i++
      }
    } while (i<this.PayPalFeeList.length)
    this.uploadComplete = false;
  }
}
