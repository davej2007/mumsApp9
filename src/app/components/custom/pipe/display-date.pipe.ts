import { Pipe, PipeTransform } from '@angular/core';
import { Months } from 'src/app/components/custom/directive/functions'

@Pipe({
  name: 'displayDate'
})
export class DisplayDatePipe implements PipeTransform {

  
  transform(value: number): unknown {
    if (value==0) return null
    let firstDate:any = new Date(value)
    let output = firstDate.getDate().toString()+' '+Months[firstDate.getMonth()]+' '+firstDate.getFullYear().toString()
    .slice(-2);
    return output
  }

}
