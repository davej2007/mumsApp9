import { Pipe, PipeTransform } from '@angular/core';
import { Months } from 'src/app/components/custom/directive/functions'
@Pipe({
  name: 'chooseDate'
})
export class ChooseDatePipe implements PipeTransform {
  transform(value:Array<number>, fl:number): unknown {
    let firstDate:any = new Date(value[0])
    let length = value.length
    let lastDate:any = new Date(value[length-1])
    if (fl==1){
      return lastDate.getDate().toString()+' '+Months[lastDate.getMonth()]+' '+lastDate.getFullYear().toString().slice(-2); 
    } else if(fl==0 && length > 1){
      return value.length;
    } else {
      return '...';
    }
  }
}