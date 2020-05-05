import { SortDirection } from '../directive/sortable.directive';
import { IAUCTION } from './auction';
import { IVISIT } from './visit';

export interface IASEARCHRESULT {
  entries: IAUCTION[];
  total: number;
  grandTotal:number;
}
export interface IASTATE {
  page: number,
  pageSize: number,
  searchTerm: string,
  sortDirection: SortDirection,
  category : number,
  status : Array<number>,
  displayDate : IDISPLAYDATE
}
export interface IVSEARCHRESULT {
  entries: IVISIT[],
  total: number
}
export interface IVSTATE {
    page: number,
    pageSize: number,
    sortDirection: SortDirection,
    displayDate : IDISPLAYDATE
  }
  export interface IDISPLAYDATE {
    month:number,
    year:number
  }