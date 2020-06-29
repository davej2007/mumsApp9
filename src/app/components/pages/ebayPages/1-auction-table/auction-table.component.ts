import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { STATUS, CATEGORIES }         from 'src/app/components/custom/directive/defaultValues';
import { IAUCTION }                   from 'src/app/components/custom/interface/auction';
import { aDayIs, days }                     from 'src/app/components/custom/directive/functions';
import { AuctionTableControlService } from 'src/app/components/services/ebay/table-control-auction.service';
import { AuctionService }             from 'src/app/components/services/ebay/auction.service';
// Modals
import { NewAuctionModalContent }     from '../MODALS/0-NewAuction/newAuction';
import { UnSoldModalContent }         from '../MODALS/1-UnSold/unSold';
import { SoldModalContent }           from '../MODALS/2-Sold/sold';
import { AUTHService } from 'src/app/components/AUTH-Modules/AUTH.service';

@Component({
  selector: 'auction-table',
  templateUrl: './auction-table.component.html',
  styleUrls: ['./auction-table.component.css']
})
export class AuctionTableComponent implements OnInit{

  Auctions$: Observable<IAUCTION[]>;
  total$: Observable<number>;

  constructor(
    public  tableService: AuctionTableControlService,
    private activatedRoute:ActivatedRoute,
    public modalService: NgbModal,
    public _auction:AuctionService,
    public _Router:Router,
    public _AUTH:AUTHService
    ) {
      this.Auctions$ = tableService.auctions$;
      this.total$ = tableService.total$;
    }

  public StatusList : any = STATUS;
  public CategoryList : any = CATEGORIES;
  public Days : Array<String> = days;
  public StatusShow : [number];
  public toDay : number = Date.parse(new Date().toDateString())

  ngOnInit(){
    this.activatedRoute.data.subscribe(
      data=>{
        this.StatusShow = data.status;
        this.tableService.status=this.StatusShow
        if(data.info.success){
          this.tableService.AUCTIONS = data.info.auctions;
        } else {
          alert(data.message)
        }
      },
      err =>  {
        alert('Server Error : '+err.message+' If this continues Please contact Systems.');
      }
    )
  }
  checkStatusActive(st:any){
    if(this.tableService.status.length==1 && this.tableService.status[0] != st) {
      return false
    } else if(this.tableService.status.length>1 && st!=-1) {
      return false
    } else {
      return true
    }
  }
  checkDayActive(i:Number){
    if(this.tableService.displayDay == i){
      return true
    } else {
      return false
    }
  }
  needToRenew(entry:any){
    if (entry.status !=0 && entry.auction.dateListed[entry.auction.dateListed.length-1]+aDayIs*8<this.toDay) return true
    return false;
  }
  isDraft(d:number){
    if(d==0) return true;
    return false
  }
  // Modal Buttons
  openUnsold(auction:IAUCTION){
    const modalRef = this.modalService.open(UnSoldModalContent, {backdrop:'static'});
    modalRef.componentInstance.id = auction._id;
    modalRef.componentInstance.description = auction.auction.description;
    modalRef.componentInstance.lastDateListed = auction.auction.dateListed[auction.auction.dateListed.length-1];
    modalRef.result.then(
      res => {
        if(res.success){
          this.reloadTableData()
        } else {
          console.log('Error from Modal : ', res)
        }
      },
      reason => { console.log('UnSold Cancelled.') }
    );
  }
  openNewAuction() {
    this.modalService.open(NewAuctionModalContent, {backdrop:'static', size: 'xl'}).result.then(
      res => {
        if(res.success){
          this.reloadTableData()
        } else {
          console.log('Error from Modal : ', res)
        }
      },
      reason => { console.log('Create Cancelled.') }
    );
  }
  openSold(auction:IAUCTION){
    const modalRef = this.modalService.open(SoldModalContent, {backdrop:'static'});
    modalRef.componentInstance.id = auction._id;
    modalRef.componentInstance.lastDateListed = auction.auction.dateListed[auction.auction.dateListed.length-1];
    modalRef.componentInstance.description = auction.auction.description;
    modalRef.result.then(
      res => {
        if(res.success){
          this.reloadTableData()
        } else {
          console.log('Error from Modal : ', res)
        }
      },
      reason => { console.log('SOld Cancelled.') }
    );
  }
  reloadTableData(){
    let old:number = this.tableService.category;
    this._auction.getAuctionDetails().subscribe(
      data=>{
        if(data.success){
          this.tableService.category = undefined;
          this.tableService.AUCTIONS = data.auctions;
          this.tableService.category = old;
          this.tableService.searchTerm = '';
        } else {
          console.log(data.message)
        }
      },
      err=>{console.log(err)}
      )
  }
}