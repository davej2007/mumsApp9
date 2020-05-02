import { SortColumn, SortDirection } from '../directive/sortable.directive';
import { IAUCTION } from './auction';

export interface ISEARCHRESULT {
  entries: IAUCTION[];
  total: number;
  grandTotal:number;
}
export interface IDISPLAYDATE {
  month:number,
  year:number
}
export interface ISTATE {
    page: number,
    pageSize: number,
    searchTerm: string,
    sortDirection: SortDirection,
    category : number,
    status : Array<number>,
    displayDate : IDISPLAYDATE
  }