import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';

import { SortDirection }                        from 'src/app/components/custom/directive/sortable.directive';
import { IVISIT }                               from 'src/app/components/custom/interface/visit';
import { IVSTATE, IVSEARCHRESULT, IDISPLAYDATE }  from 'src/app/components/custom/interface/state';

@Injectable({providedIn: 'root'})

export class VisitTableControlService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _visits$ = new BehaviorSubject<IVISIT[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: IVSTATE = {
    page: 1,
    pageSize: 10,
    sortDirection: 'desc',
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
      this._visits$.next(result.entries);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  public VISITS :Array<IVISIT>;

  get visits$()   { return this._visits$.asObservable(); }
  get total$()    { return this._total$.asObservable(); }
  get loading$()  { return this._loading$.asObservable(); }
  get page()      { return this._state.page; }
  get pageSize()  { return this._state.pageSize; }
  
  get sortDirection() { return this._state.sortDirection; }
  get displayDate()   { return this._state.displayDate; }
  
  set page(page: number)                          { this._set({page}); }
  set pageSize(pageSize: number)                  { this._set({pageSize}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }
  set displayDate(displayDate: IDISPLAYDATE)      { this._set({displayDate}); }

  private _set(patch: Partial<IVSTATE>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }
  private _search(): Observable<IVSEARCHRESULT> {
    const { sortDirection, pageSize, page} = this._state;

    // 1. sort
    let entries = sort(this.VISITS, sortDirection);

    const total = entries.length;
    // 3. paginate
    entries = entries.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({entries, total});
  }
}

const compare = (v1: number, v2: number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
function sort(entries: IVISIT[],  direction: string): IVISIT[] {
  if (direction === '' ) {
    return entries;
  } else {
    return [...entries].sort((a, b) => {
      const res = compare(a.date, b.date );
      return direction === 'asc' ? res : -res;
    });
  }
}