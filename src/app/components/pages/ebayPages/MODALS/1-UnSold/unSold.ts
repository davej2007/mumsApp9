import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuctionService } from 'src/app/components/services/ebay/auction.service';
import { ConvertDate } from 'src/app/components/custom/directive/functions';

@Component({
  selector: 'unSold-modal-content',
  templateUrl: `./unSold.html`,
  styleUrls: ['../modal.css']
})

export class UnSoldModalContent implements OnInit {
  @Input() id:String;
  @Input() description:String;
  @Input() lastDateListed:number
  constructor(
    public activeModal: NgbActiveModal,
    public auction:AuctionService) {}
  // Variables
    public errorMsg:String = '';
    public successMsg:String = '';
    public processing:Boolean = false;
    public dateListed:string
  
  ngOnInit(){
    this.dateListed = ConvertDate(this.lastDateListed)
  }
  relist(date:string){
    this.processing = true;
    let lastDateValue = Date.parse(new Date(this.lastDateListed).toDateString())
    let today = Date.parse(new Date().toDateString())
    let dateValue = Date.parse(new Date(date).toDateString());
    if(lastDateValue>=dateValue || today<dateValue){
      this.errorMsg = 'Invalid Date Entered';
      setTimeout(()=>{
        this.errorMsg = '';
        this.dateListed = ConvertDate(this.lastDateListed)
        this.processing = false;
      }, 2000);
    } else {
      this.auction.updateReListByID(this.id, date ).subscribe(
        data => {
          if(!data.success){            
            this.errorMsg = data.message;
            setTimeout(()=>{
              this.errorMsg = '';
              this.processing = false;
            }, 2000);
          } else {
            this.successMsg='Auction Updated: '+data.auction.auction.description;
            setTimeout(()=>{
              this.successMsg = '';
              this.activeModal.close(data);
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
}