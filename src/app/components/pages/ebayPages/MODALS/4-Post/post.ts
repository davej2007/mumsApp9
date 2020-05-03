import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { AuctionService } from 'src/app/components/services/ebay/auction.service';

@Component({
  selector: 'post-modal-content',
  templateUrl: `./post.html`,
  styleUrls: ['../modal.css']
})
export class PostModalContent implements OnInit {
  @Input() id:String;
  @Input() description:String;
  @Input() method:String
  @Input() buyerName:String;
  @Input() buyerPostCode:String;

  constructor(
    public activeModal: NgbActiveModal,
    private fb:FormBuilder,
    public _Auction:AuctionService) {}
  // form Get
  get company()  { return this.PostForm.get('company');   }
  get trackingNo()   { return this.PostForm.get('trackingNo');   }
  get courierCost()  { return this.PostForm.get('courierCost');   }  
  get name()  { return this.PostForm.get('name');   }
  get postCode()  { return this.PostForm.get('postCode');   }

  ngOnInit(){
    if(this.buyerName !=null) this.name.setValue(this.buyerName)
    if(this.buyerPostCode !=null) this.postCode.setValue(this.buyerPostCode)
    if(this.method !=null) this.company.setValue(this.method)    
  }
  // Variables
  public errorMsg:String = '';
  public successMsg:String = '';
  public processing:Boolean = false;

  // Form Definition
  PostForm = this.fb.group({
    company:['', [Validators.required]],
    trackingNo: [null],
    courierCost :[null],
    name :['', [Validators.required]],
    postCode : ['', [Validators.required]]
  })
  disableForm(){    
    this.processing = true;
    this.company.disable();
    this.trackingNo.disable();
    this.courierCost.disable();
    this.name.disable();
    this.postCode.disable();
  }
  enableForm(){
    this.processing = false;
    this.company.enable();
    this.trackingNo.enable();
    this.courierCost.enable();
    this.name.enable();
    this.postCode.enable();
  }
  submit(PostDetails:any){
    this.disableForm();
    if (PostDetails.trackingNo == null) PostDetails.trackingNo=' '
    if (PostDetails.name == null) PostDetails.name=' '
    if (PostDetails.postCode == null) PostDetails.postCode=' '
    if (PostDetails.courierCost==null) PostDetails.courierCost = 0;
    let postAuctionData = {
      id : this.id,
      company : PostDetails.company,
      trackingNo : PostDetails.trackingNo.trim(),
      courierCost : PostDetails.courierCost,
      name : PostDetails.name.trim(),
      postCode : PostDetails.postCode.trim()
    }
    this._Auction.updatePostAuction(postAuctionData).subscribe(
      data => {
        if(!data.success){
          this.disableForm()
          this.errorMsg = data.message;
          setTimeout(()=>{
            this.errorMsg = '';
            this.enableForm();
          }, 2000);
        } else {
          this.successMsg='Auction Dispatched : '+data.auction.auction.description;
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