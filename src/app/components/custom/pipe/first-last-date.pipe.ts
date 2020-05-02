import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chooseDate'
})
export class FirstLastDatePipe implements PipeTransform {
  public MONTHS :any =['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  
  transform(value:Array<number>, fl:number): unknown {
    let firstDate:any = new Date(value[0])
    let length = value.length
    let lastDate:any = new Date(value[length-1])
    if (fl==1){
      return lastDate.getDate().toString()+' '+this.MONTHS[lastDate.getMonth()]+' '+lastDate.getFullYear().toString().slice(-2); 
    } else if(fl==0 && length > 1){
      return firstDate.getDate().toString()+' '+this.MONTHS[firstDate.getMonth()]+' '+firstDate.getFullYear().toString().slice(-2);
    } else {
      return '...';
    }
  }
}