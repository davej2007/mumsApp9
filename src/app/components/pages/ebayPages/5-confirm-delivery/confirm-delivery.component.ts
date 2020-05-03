import { Component, QueryList, ViewChildren, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
// import { NgbdSortableHeader, SortEvent } from '../src/app/components/custom/directive/sortable.directive';

import { IAUCTION } from 'src/app/components/custom/interface/auction';
import { IDISPLAYDATE } from 'src/app/components/custom/interface/state';
import { STATUS, CATEGORIES } from 'src/app/components/custom/directive/defaultValues';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuctionService } from 'src/app/components/services/ebay/auction.service';
import { DeliveryTableControlService } from 'src/app/components/services/ebay/table-control-delivery.service';
import { DeliveryModalContent } from '../MODALS/5-Delivery/delivery';

@Component({
  selector: 'confirm-delivery',
  templateUrl: './confirm-delivery.component.html',
  styleUrls: ['./confirm-delivery.component.css']
})
export class ConfirmDeliveryComponent implements OnInit {

  Auctions$: Observable<IAUCTION[]>;
  total$: Observable<number>;

  // @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    public tableService: DeliveryTableControlService,
    private activatedRoute:ActivatedRoute,
    public modalService: NgbModal,
    public _auction:AuctionService,
    public _Router:Router
    ) {
      this.Auctions$ = tableService.auctions$;
      this.total$ = tableService.total$;
    }

  public StatusList   : any = STATUS;
  public CategoryList : any = CATEGORIES;
  public CourierShow  : Array<number> = [0,1,2]
  public CourierList  : any = ['Collect','RoyalMail','Hermes']

  ngOnInit(): void {    
    this.tableService.status =  this.CourierShow;    
    this.tableService.searchTerm = '';
    this.activatedRoute.data.subscribe(
      data=>{
        if(data.info.success){
          this.tableService.AUCTIONS = data.info.auctions;
        } else {
          console.log(data.message)
        }
      },
      err =>  {
        alert('Server Error : '+err.message+' If this continues Please contact Systems.');
      }
    )
  }
  checkCourierActive(st:any){
    if(this.tableService.status.length==1 && this.tableService.status[0] != st) {
      return false
    } else if(this.tableService.status.length>1 && st!=-1) {
      return false
    } else {
      return true
    }
  }
  openDelivery(auction:IAUCTION){
    const modalRef = this.modalService.open(DeliveryModalContent, {backdrop:'static'});
    modalRef.componentInstance.id = auction._id;
    modalRef.componentInstance.description = auction.auction.description;
    modalRef.componentInstance.company = auction.courier.company;
    modalRef.componentInstance.trackingNo = auction.courier.trackingNo;
    modalRef.componentInstance.dateSold = auction.sold.dateSold;
    modalRef.result.then(
      res => {
        if(res.success){
          this.reloadTableData()
        } else {
          console.log('Error from Modal : ', res)
        }
      }
    );
  }
  reloadTableData(){
    this._auction.getUnDeliveredAuctionDetails().subscribe(
      data=>{
        if(data.success){
          this.tableService.AUCTIONS = data.auctions;
          this.tableService.searchTerm = '';
        } else {
          console.log(data.message)
        }
      },
      err=>{console.log(err)}
      )
  }
}