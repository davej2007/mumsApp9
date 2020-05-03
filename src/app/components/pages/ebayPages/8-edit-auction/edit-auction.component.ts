import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuctionService } from 'src/app/components/services/ebay/auction.service';
import { IAUCTION } from 'src/app/components/custom/interface/auction';
import { STATUS, CATEGORIES } from 'src/app/components/custom/directive/defaultValues';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { ConvertDate } from 'src/app/components/custom/directive/functions';


@Component({
  selector: 'edit-auction',
  templateUrl: './edit-auction.component.html',
  styleUrls: ['./edit-auction.component.css']
})
export class EditAuctionComponent implements OnInit {

  constructor(
    private activatedRoute:ActivatedRoute,
    private fb:FormBuilder,   
    public _Auction:AuctionService,
    public _Router:Router) { }

  // Variables  
  public errorMsg:String = null;
  public successMsg:String = null;
  public processing:Boolean = false;
  public changes:Boolean = false;
  public AUCTION : IAUCTION = null;
  public StatusList : any = STATUS;
  public CategoryList : any = CATEGORIES;
  public page:number = 0;

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
    data=>{
      if(data.info.success){
        this.AUCTION = data.info.auction;
        this.description.setValue(this.AUCTION.auction.description);
        this.initialPrice.setValue(this.AUCTION.auction.initialPrice);
        this.postageCharged.setValue(this.AUCTION.auction.postage);
        this.weight.setValue(this.AUCTION.auction.weight);
        this.category.setValue(this.AUCTION.category);
        this.AUCTION.auction.dateListed.forEach(e => {
          let d = new Date(e); 
          this.t.push(this.fb.group({dateListed: [d.getFullYear().toString()+'-'+('0'+(d.getMonth()+1).toString()).slice(-2)+'-'+('0'+d.getDate().toString()).slice(-2), Validators.required]}))
        });
        // sold
        let sd = new Date(this.AUCTION.sold.dateSold);
        this.dateSold.setValue(sd.getFullYear().toString()+'-'+('0'+(sd.getMonth()+1).toString()).slice(-2)+'-'+('0'+sd.getDate().toString()).slice(-2));
        this.buyerUserName.setValue(this.AUCTION.sold.buyer.userName);
        this.buyerName.setValue(this.AUCTION.sold.buyer.name);
        this.buyerPostCode.setValue(this.AUCTION.sold.buyer.postCode);
        this.auctionNumber.setValue(this.AUCTION.sold.auctionNo);  
        this.pricePaid.setValue(this.AUCTION.sold.price);
        // paid
        this.postagePaid.setValue(this.AUCTION.paid.postage);
        this.methodPayment.setValue(this.AUCTION.paid.paidBy);
        this.paypalTransactionNo.setValue(this.AUCTION.paid.transactionNo);
        // fees
        this.ebayFinalFee.setValue(this.AUCTION.fee.finalFee.cost);
        this.ebayPostageFee.setValue(this.AUCTION.fee.postageFee.cost);
        this.paypalFee.setValue(this.AUCTION.fee.paypalFee.cost);
        // courier
        this.courierCompany.setValue(this.AUCTION.courier.company);
        this.courierTrackingNo.setValue(this.AUCTION.courier.trackingNo);
        this.courierCost.setValue(this.AUCTION.courier.cost);
        this.courierDelivered.setValue(ConvertDate(this.AUCTION.courier.delivered));
      } else {
        alert(data.message)
      }
    },
    err =>  {
      alert('Server Error : '+err.message+' If this continues Please contact Systems.');
    }
  )}
  // Form Definition
  auctionDetailsForm = this.fb.group({
    description: ['', Validators.required],
    dateListed: new FormArray([]),
    initialPrice:[null, [Validators.required]],
    category:[null, [Validators.required]],
    postageCharged:[null, [Validators.required]],
    weight:[null, [Validators.required]]
  })
  // form Get
  get f()               { return this.auctionDetailsForm.controls; }
  get t()               { return this.f.dateListed as FormArray; }
  get category()        { return this.auctionDetailsForm.get('category');   }
  get description()     { return this.auctionDetailsForm.get('description');}
  get initialPrice()    { return this.auctionDetailsForm.get('initialPrice');   }
  get postageCharged()  { return this.auctionDetailsForm.get('postageCharged');   }
  get weight()          { return this.auctionDetailsForm.get('weight');   }
  // Form Definition
  buyerDetailsForm = this.fb.group({
    dateSold: [null],
    buyerUserName:[''],
    buyerName:[null],
    buyerPostCode:[null],
    auctionNumber:[null],
    pricePaid:[null],
    postagePaid:[null],
    methodPayment:[null],
    paypalTransactionNo:[null],
  })
  // form Get
  get dateSold()  { return this.buyerDetailsForm.get('dateSold');   }
  get buyerUserName()  { return this.buyerDetailsForm.get('buyerUserName');   }  
  get buyerName()  { return this.buyerDetailsForm.get('buyerName');   }  
  get buyerPostCode()  { return this.buyerDetailsForm.get('buyerPostCode');   }  
  get auctionNumber()  { return this.buyerDetailsForm.get('auctionNumber');   }   
  get pricePaid()  { return this.buyerDetailsForm.get('pricePaid');   }
  get postagePaid()  { return this.buyerDetailsForm.get('postagePaid');   }
  get methodPayment()  { return this.buyerDetailsForm.get('methodPayment');   }
  get paypalTransactionNo()  { return this.buyerDetailsForm.get('paypalTransactionNo');   }
    // Form Definition
  feeCourierDetailsForm = this.fb.group({
    ebayFinalFee : [null],
    ebayPostageFee : [null],
    paypalFee : [null],
    courierCompany : [null],
    courierTrackingNo : [null],
    courierCost : [null],
    courierDelivered : [null],
  })
  // form Get
  get ebayFinalFee()  { return this.feeCourierDetailsForm.get('ebayFinalFee');   }
  get ebayPostageFee()  { return this.feeCourierDetailsForm.get('ebayPostageFee');   }
  get paypalFee()  { return this.feeCourierDetailsForm.get('paypalFee');   }
  get courierCompany()  { return this.feeCourierDetailsForm.get('courierCompany');   }
  get courierTrackingNo()  { return this.feeCourierDetailsForm.get('courierTrackingNo');   }
  get courierCost()  { return this.feeCourierDetailsForm.get('courierCost');   }
  get courierDelivered()  { return this.feeCourierDetailsForm.get('courierDelivered');   }
  
  cancel(){
    console.log('cancel pressed')
  }
  submitAuctionDetails(data:any){
    this.processing = true;
    this.AUCTION.category = data.category;
    this.AUCTION.auction.description = data.description;
    this.AUCTION.auction.initialPrice = data.initialPrice;
    this.AUCTION.auction.postage = data.postageCharged;
    this.AUCTION.auction.weight = data.weight;
    this.AUCTION.auction.dateListed = [];
    data.dateListed.forEach(e => {
      this.AUCTION.auction.dateListed.push(Date.parse(e.dateListed))
    });
    this.processing = false;
    this.changes = true;
  }
  submitBuyerDetails(data:any){
    this.processing = true;
    this.AUCTION.sold.dateSold = Date.parse(data.dateSold)
    this.AUCTION.sold.buyer={userName:data.buyerUserName, name:data.buyerName, postCode:data.postCode};
    this.AUCTION.sold.auctionNo = data.auctionNumber;  
    this.AUCTION.sold.price = data.pricePaid;
    this.AUCTION.paid.postage = data.postagePaid;
    this.AUCTION.paid.paidBy = data.methodPayment;
    this.AUCTION.paid.transactionNo = data.paypalTransactionNo;
    this.processing = false;
    this.changes = true;
  }
  submitFeeCourierDetails(data:any){
    this.processing = true;
    // fees
    this.AUCTION.fee.finalFee.cost = data.ebayFinalFee;
    this.AUCTION.fee.postageFee.cost = data.ebayPostageFee;
    this.AUCTION.fee.paypalFee.cost = data.paypalFee;
    // courier
    this.AUCTION.courier.company = data.courierCompany
    this.AUCTION.courier.trackingNo = data.courierTrackingNo
    this.AUCTION.courier.cost = data.courierCost;
    this.AUCTION.courier.delivered = Date.parse(data.courierDelivered);
    this.processing = false;
    this.changes = true;
  }
  saveUpdatedDetails(){
    this.processing = true;
    this._Auction.updateAuctionByID(this.AUCTION).subscribe(
      data => {
        if(!data.success){
          this.errorMsg = data.message;
          setTimeout(()=>{
            this.errorMsg = '';
            this.processing = false;;
          }, 2000);
        } else {
          this.successMsg='Auction Updated : '+data.auction.auction.description;
          setTimeout(()=>{
            this.successMsg = '';
            this._Router.navigateByUrl('/')           
          }, 2000);
        }
      },
      err => {
        alert('Server Error : '+err.message+' If this continues Please contact Systems.');
        this.processing = false;
      }
    )
  }
}