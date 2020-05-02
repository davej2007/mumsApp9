import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayDate'
})
export class DisplayDatePipe implements PipeTransform {
  public MONTHS :any =['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  
  transform(value: number): unknown {
    let firstDate:any = new Date(value)
    let output = firstDate.getDate().toString()+' '+this.MONTHS[firstDate.getMonth()]+' '+firstDate.getFullYear().toString()
    .slice(-2);
    return output


    
  }

}
