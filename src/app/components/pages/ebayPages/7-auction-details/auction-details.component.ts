import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuctionService } from 'src/app/components/services/ebay/auction.service';
import { IAUCTION } from 'src/app/components/custom/interface/auction';
import { STATUS, CATEGORIES } from 'src/app/components/custom/directive/defaultValues';

@Component({
  selector: 'auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.css']
})
export class AuctionDetailsComponent implements OnInit {

  constructor(
    private activatedRoute:ActivatedRoute,    
    public _Auction:AuctionService) { }

  // Variables
  public processing:Boolean = false;
  public AUCTION : IAUCTION = null;
  public StatusList : any = STATUS;
  public CategoryList : any = CATEGORIES;
  

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(
    data=>{
      if(data.info.success){
        this.AUCTION = data.info.auction;
        this.processing = true;
      } else {
        alert(data.message)
      }
    },
    err =>  {
      alert('Server Error : '+err.message+' If this continues Please contact Systems.');
    }
  )}

}
