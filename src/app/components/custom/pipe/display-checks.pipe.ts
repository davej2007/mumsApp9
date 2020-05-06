import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayChecks'
})
export class DisplayChecksPipe implements PipeTransform {

  transform(value: any): String {
    let output =''
    if (value.water)    { output+='Water OK'      } else { output+='Water'      }
    if (value.windows)  { output+=' : Windows OK' } else { output+=' : Windows' }
    if (value.doors)    { output+=' : Doors OK'   } else { output+=' : Doors'   }
    return output;
  }

}
