import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';

import { SortDirection }                        from 'src/app/components/custom/directive/sortable.directive';
import { IAUCTION }                             from 'src/app/components/custom/interface/auction';
import { IASTATE, IASEARCHRESULT, IDISPLAYDATE }  from 'src/app/components/custom/interface/state';

@Injectable({providedIn: 'root'})

export class AuctionTableControlService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _auctions$ = new BehaviorSubject<IAUCTION[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: IASTATE = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortDirection: 'desc',
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
  
  get sortDirection() { return this._state.sortDirection; }
  get searchTerm() { return this._state.searchTerm; }
  get category() { return this._state.category; }
  get status() { return this._state.status; }
  get displayDate() { return this._state.displayDate; }
  
  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }
  set category(category: number) { this._set({category}); }
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
    entries = entries.filter(entry => categoryCheck(entry, this.category));
    entries = entries.filter(entry => statusCheck(entry, this.status));
    const total = entries.length;
    const grandTotal = null
    // 3. paginate
    entries = entries.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({entries, total, grandTotal});
  }
}
function matches(entry: IAUCTION, term: string) {
  return entry.auction.description.toLowerCase().includes(term.toLowerCase())
}
function categoryCheck(entry: IAUCTION, cat: number) {
  if (cat === undefined || entry.category == cat) {
    return true
  } else {
    return false
  };
}
function statusCheck(entry: IAUCTION, sta: Array<number>) {
  if(sta.indexOf(entry.status)!==-1){
    return true
  } else {
    return false
  };
}
const compare = (v1: number, v2: number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
function sort(entries: IAUCTION[],  direction: string): IAUCTION[] {
  if (direction === '' ) {
    return entries;
  } else {
    return [...entries].sort((a, b) => {
      const res = compare(a.auction.dateListed[a.auction.dateListed.length-1], b.auction.dateListed[b.auction.dateListed.length-1] );
      return direction === 'asc' ? res : -res;
    });
  }
}