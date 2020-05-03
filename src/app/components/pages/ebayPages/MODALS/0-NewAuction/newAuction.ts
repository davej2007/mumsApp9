import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CATEGORIES } from 'src/app/components/custom/directive/defaultValues'
import { AuctionService } from 'src/app/components/services/ebay/auction.service';


@Component({
  selector: 'newAuction-modal-content',
  templateUrl: `./newAuction.html`,
  styleUrls: ['../modal.css']
})
export class NewAuctionModalContent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    private fb:FormBuilder,
    public auction:AuctionService) {}

  // form Get
  get dateListed()      { return this.newAuctionForm.get('dateListed');   }
  get description()     { return this.newAuctionForm.get('description');   }
  get initialPrice()    { return this.newAuctionForm.get('initialPrice');   }
  get category()        { return this.newAuctionForm.get('category');   }
  get postagePaid()     { return this.newAuctionForm.get('postagePaid');   }
  get weight()          { return this.newAuctionForm.get('weight');   }
  
  ngOnInit(){}
    
  // Variables
  public errorMsg:String = '';
  public successMsg:String = '';
  public processing:Boolean = false;
  public descriptionValid:Boolean = true;
  public categories : any = CATEGORIES
  
  // Form Definition
  newAuctionForm = this.fb.group({
    dateListed: [null, [Validators.required]],
    description:['', [Validators.required]],
    initialPrice:[null, [Validators.required]],
    category:[null, [Validators.required]],
    postagePaid:[null, [Validators.required]],
    weight:[null, [Validators.required]]
  })
  disableForm(){    
    this.processing = true;
    this.dateListed.disable();
    this.description.disable();
    this.initialPrice.disable();
    this.category.disable();
    this.postagePaid.disable();
    this.weight.disable();
  }
  enableForm(){
    this.processing = false;
    this.dateListed.enable();
    this.description.enable();
    this.initialPrice.enable();
    this.category.enable();
    this.postagePaid.enable();
    this.weight.enable();
  }
  submit(newAuction){
    this.disableForm();
    let newAuctionData = {
      dateListed:Date.parse(newAuction.dateListed),
      description:newAuction.description.trim(),
      initialPrice:Math.round(newAuction.initialPrice*100),
      postagePaid:Math.round(newAuction.postagePaid*100),
      category:newAuction.category,
      weight:newAuction.weight
    }
    this.auction.createNewAuction(newAuctionData).subscribe(
      data => {
        if(!data.success){
          this.disableForm()
          this.errorMsg = data.message;
          setTimeout(()=>{
            this.errorMsg = '';
            this.enableForm();
          }, 2000);
        } else {
          this.successMsg='New Auction : '+data.auction.auction.description;
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