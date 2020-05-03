import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuctionService } from 'src/app/components/services/ebay/auction.service';

export interface IFEESINPUT {
  _id           : string,    
  placeInArray  : number,
  ebayAuctionNo : string,
  finalFeeSet   : boolean,
  finalValueFee : number,
  promo         : boolean,
  postageSet    : boolean,
  postageFee    : number,
  description   : string,
  buyerName     : string,
  buyerUserName : string,
  uploaded      : boolean,
  error         : boolean
  }

@Component({
  selector: 'ebay-fees',
  templateUrl: './ebay-fees.component.html',
  styleUrls: ['./ebay-fees.component.css']
})
export class EbayFeesComponent implements OnInit {

  constructor(
    private fb:FormBuilder,
    public _auction:AuctionService
    ) { }
  
  // Form Gets
  get _id()           { return this.FeeForm.get('_id');           }    
  get placeInArray()  { return this.FeeForm.get('placeInArray');  }
  get ebayAuctionNo() { return this.FeeForm.get('ebayAuctionNo'); }
  get finalFeeSet()   { return this.FeeForm.get('finalFeeSet');   }
  get finalValueFee() { return this.FeeForm.get('finalValueFee'); }
  get promo()         { return this.FeeForm.get('promo');         }
  get postageSet()    { return this.FeeForm.get('postageSet');    }
  get postageFee()    { return this.FeeForm.get('postageFee');    }
  get description()   { return this.FeeForm.get('description');   }
  get buyerName()     { return this.FeeForm.get('buyerName');     }
  get buyerUserName() { return this.FeeForm.get('buyerUserName'); }

  ngOnInit(): void {
  }
  // Variables
  public errorMsg         : String = '';
  public successMsg       : String = '';
  public processing       : Boolean = false;
  public ebayAuctionValid : Boolean = false;
  public ebayAuctionError : string = '';
  public EbayFeeList      : Array<IFEESINPUT> = [];
  public hasErrors        : Boolean = false;
  public uploadComplete   : Boolean = false;

  FeeForm = this.fb.group({
    _id               : [ null ],    
    placeInArray      : [ undefined ],
    ebayAuctionNo     : ['', [Validators.required]],
    finalFeeSet       : [ null ],
    finalValueFee     : [ null ],
    promo             : [ false ],
    postageSet        : [ null ],
    postageFee        : [ null ],
    description       : [ null ],
    buyerName         : [ null ],
    buyerUserName     : [ null ]
  })
  disableForm(){
    this.processing =true;
    this.ebayAuctionNo.disabled;
    this.promo.disabled;
    this.finalValueFee.disabled;
    this.postageFee.disabled;
  }
  enableForm(){
    this.processing = false;
    this.ebayAuctionNo.enabled;
    this.promo.enabled;
    this.finalValueFee.enabled;
    this.postageFee.enabled;
  }

  findEbayAuction(){
    let index : number = this.EbayFeeList.findIndex((i: any ) => i.ebayAuctionNo === this.ebayAuctionNo.value)
    if(index!==-1){
      this._id.setValue(this.EbayFeeList[index]._id);    
      this.placeInArray.setValue(index)
      this.finalFeeSet.setValue(this.EbayFeeList[index].finalFeeSet);
      this.finalValueFee.setValue(this.EbayFeeList[index].finalValueFee/100);
      this.promo.setValue(this.EbayFeeList[index].promo);this.postageSet;
      this.postageFee.setValue(this.EbayFeeList[index].postageFee/100);
      this.postageSet.setValue(this.EbayFeeList[index].postageSet);
      this.description.setValue(this.EbayFeeList[index].description);
      this.buyerName.setValue(this.EbayFeeList[index].buyerName);
      this.buyerUserName.setValue(this.EbayFeeList[index].buyerUserName);
      this.ebayAuctionValid = true;
      this.ebayAuctionError = '';
    } else {
      this._auction.findEbayAuctionNumber(this.ebayAuctionNo.value).subscribe(
        data=>{
          if(data.success){
            console.log(data.auction)
            this._id.setValue(data.auction._id);
            this.placeInArray.setValue(undefined)
            this.finalFeeSet.setValue(data.auction.fee.finalFee.set);
            this.finalValueFee.setValue(data.auction.fee.finalFee.cost/100);
            this.promo.setValue(data.auction.fee.finalFee.promo);
            this.postageFee.setValue(data.auction.fee.postageFee.cost/100);
            this.postageSet.setValue(data.auction.fee.postageFee.set);
            this.description.setValue(data.auction.auction.description);
            this.buyerName.setValue(data.auction.sold.buyer.name);
            this.buyerUserName.setValue(data.auction.sold.buyer.userName);          
            this.ebayAuctionValid = true;
            this.ebayAuctionError = '';
          } else {
            this._id.setValue(null);
            this.placeInArray.setValue(undefined)
            this.finalFeeSet.setValue(null);
            this.finalValueFee.setValue(null);
            this.promo.setValue(null);
            this.postageFee.setValue(null);
            this.postageSet.setValue(null);
            this.description.setValue(null);
            this.buyerName.setValue(null);
            this.buyerUserName.setValue(null);
            this.ebayAuctionValid = false;
            this.ebayAuctionError = data.message;
          }
        },
        err =>  {
          alert('Server Error : '+err.message+' If this continues Please contact Systems.');
        }
      )
    }
  }
  submit(feeData:IFEESINPUT){
    this.disableForm()
    feeData.finalValueFee = Math.round(feeData.finalValueFee*100)
    feeData.postageFee = Math.round(feeData.postageFee*100)
    if(feeData.placeInArray !== undefined){
      this.EbayFeeList[feeData.placeInArray].finalValueFee = feeData.finalValueFee;
      this.EbayFeeList[feeData.placeInArray].promo = feeData.promo;
      this.EbayFeeList[feeData.placeInArray].postageFee = feeData.postageFee;
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
      if(feeData.promo) feeData.postageSet = false;
      this.EbayFeeList.push(feeData);
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
    this.EbayFeeList.forEach(entry => {
      let data = {
        id          : entry._id,
        finalFee    : {cost:entry.finalValueFee, promo:entry.promo, set:entry.finalFeeSet, completed:true},
        postageFee  : {cost:entry.postageFee, set:entry.postageSet, completed:true},
        paypalFee   : {cost:undefined, set:undefined, completed:undefined}};  
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
      if(this.EbayFeeList[i].uploaded){
        this.EbayFeeList.splice(i, 1)
      } else {
        i++
      }
    } while (i<this.EbayFeeList.length)
    this.uploadComplete = false;
  }
}
