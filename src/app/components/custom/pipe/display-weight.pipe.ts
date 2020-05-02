import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayWeight'
})
export class DisplayWeightPipe implements PipeTransform {

  transform(value: number): string {
    let output : string = 'N/A'
    if (value !== null && value !=0 ){
      if(value<1){
        output = (value * 1000).toFixed(0).toString() + 'g'
      } else {
        output = value.toFixed(3).toString() + 'kg'
      }
    } 
    return output;
  }

}
