import { SortDirection } from '../directive/sortable.directive';
import { IDISPLAYDATE } from './state';

export interface IVISIT {
  _id         : String,
  date        : number,
  type        : number,
  home        : IHOME,
  agent       : IAGENT,
  bins        : IBIN
}
export interface IHOME {
  by          :   String,
  checks      : { water:Boolean, windows:Boolean, doors:Boolean},
  comments    :   String
}
export interface IAGENT {
  time        : String,
  name        : String,
  feedback    : String
}
  export interface IBIN {
  type        : String
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
