import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';

import { SortDirection } from 'src/app/components/custom/directive/sortable.directive';

import { IAUCTION } from 'src/app/components/custom/interface/auction';
import { ISTATE, ISEARCHRESULT, IDISPLAYDATE } from 'src/app/components/custom/interface/state';

const compare = (v1: number, v2: number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(entries: IAUCTION[],  direction: string): IAUCTION[] {
  if (direction === '' ) {
    return entries;
  } else {
    return [...entries].sort((a, b) => {
      const res = compare(a.sold.dateSold, b.sold.dateSold);
      return direction === 'asc' ? res : -res;
    });
  }
}

@Injectable({providedIn: 'root'})

export class TotalsTableControlService {
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _auctions$ = new BehaviorSubject<IAUCTION[]>([]);
    private _total$ = new BehaviorSubject<number>(0);
    private _grandTotal$ = new BehaviorSubject<number>(0);
  
    private _state: ISTATE = {
      page: 1,
      pageSize: 10,
      searchTerm: '',
      sortDirection: 'asc',
      category : undefined,
      status : [],
      displayDate : {month:null, year:null}
    };
  
    constructor(private pipe: DecimalPipe) {
      this._search$.pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      ).subscribe(result => {
        this._auctions$.next(result.entries);
        this._total$.next(result.total);
        this._grandTotal$.next(result.grandTotal);
      });
  
      this._search$.next();
    }
  
    public AUCTIONS :Array<IAUCTION>;
  
    get auctions$() { return this._auctions$.asObservable(); }
    get total$() { return this._total$.asObservable(); }
    get grandTotal$() { return this._grandTotal$.asObservable(); }
    get loading$() { return this._loading$.asObservable(); }
    get category() { return this._state.category; }
    get status() { return this._state.status; }
    get displayDate() { return this._state.displayDate; }
  
    set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }
    set category(category: number) { this._set({category}); }
    set status(status: Array<number>) { this._set({status}); }
    set displayDate(displayDate: IDISPLAYDATE) { this._set({displayDate}); }

    private _set(patch: Partial<ISTATE>) {
      Object.assign(this._state, patch);
      this._search$.next();
    }
    private _search(): Observable<ISEARCHRESULT> {
      
      // 1. sort
      let entries = sort(this.AUCTIONS, this._state.sortDirection);
  
      // 2. filter
      entries = entries.filter(entry => categoryCheck(entry, this.category));
      entries = entries.filter(entry => displayDateCheck(entry, this.displayDate));
      const total = entries.length;
      let grandTotal = 0;
      entries.map(e => {
        if((e.courier.cost!=0 || e.courier.company=='Collect') && e.fee.finalFee.completed && e.fee.postageFee.completed && e.fee.paypalFee.completed) {
          let total = e.sold.price + e.paid.postage - e.courier.cost - e.fee.finalFee.cost - e.fee.postageFee.cost - e.fee.paypalFee.cost
          grandTotal += total;
        } else {
          grandTotal = -1;
        }
      })
      return of({entries, total, grandTotal});
    }
  
}

function categoryCheck(entry: IAUCTION, cat: number) {
  if (cat === undefined || entry.category == cat) {
    return true
  } else {
    return false
  };
}
function displayDateCheck(entry:IAUCTION, dd:IDISPLAYDATE){
  if(dd.month==null && dd.year==null) {
    return true;
  } else {
    let startDate:number = 0; let finishDate = 0;
    startDate=Date.parse(new Date(dd.year, dd.month).toString());
    if(dd.month==11){
      finishDate=Date.parse(new Date(dd.year+1, 0).toString())-86400000/2
    } else {
      finishDate=Date.parse(new Date(dd.year, dd.month+1).toString())-86400000/2
    }
    if(startDate<= entry.sold.dateSold && finishDate>=entry.sold.dateSold){
      return true;
    } else {
      return false
    }
  };
}  
