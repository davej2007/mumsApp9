import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';

import { SortDirection } from 'src/app/components/custom/directive/sortable.directive';

import { IAUCTION, IASTATE, IASEARCHRESULT } from 'src/app/components/custom/interface/auction';
import { IDISPLAYDATE } from 'src/app/components/custom/interface/state';

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

@Injectable({
  providedIn: 'root'
})
export class DeliveryTableControlService  {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _auctions$ = new BehaviorSubject<IAUCTION[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: IASTATE = {
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
    });

    this._search$.next();
  }

  public AUCTIONS :Array<IAUCTION>;

  get auctions$() { return this._auctions$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get status() { return this._state.status; }
  get displayDate() { return this._state.displayDate; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }
  set status(status: Array<number>) { this._set({status}); }
  set displayDate(displayDate: IDISPLAYDATE) { this._set({displayDate}); }

  private _set(patch: Partial<IASTATE>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }
  private _search(): Observable<IASEARCHRESULT> {
    const { sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let entries = sort(this.AUCTIONS, sortDirection);

    // 2. filter
    entries = entries.filter(entry => matches(entry, searchTerm));
    entries = entries.filter(entry => courierCheck(entry, this.status));
    const total = entries.length;
    const grandTotal = null
      // 3. paginate
    entries = entries.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({entries, total, grandTotal});
  }

}
function matches(entry: IAUCTION, term: string) {
  if(term==undefined || term==null || term =='') return true;
  return entry.courier.trackingNo.toLowerCase().includes(term.toLowerCase())
}

function courierCheck(entry:IAUCTION, cc:any){
  let courier = ['Collect','RoyalMail','Hermes']
  if(cc.length == 1 && entry.courier.company != courier[cc[0]]) return false
  return true
}  

