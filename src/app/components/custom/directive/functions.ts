import { AbstractControl } from "@angular/forms";

export const  aDayIs = 86400000,
              aWeekIs = 604800000,
              Months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
              Days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export function ConvertDate(dateValue:number):string{
    if (dateValue==undefined || dateValue==null || dateValue==0) return null;
    let cd = new Date(dateValue);
    return (cd.getFullYear().toString()+'-'+('0'+(cd.getMonth()+1).toString()).slice(-2)+'-'+('0'+cd.getDate().toString()).slice(-2));
}
export function DateValue(value:any):number{
    if (value==undefined || value==null || value=='' || value ==0) {
        return Date.parse(new Date().toDateString());
    } else {
        return Date.parse(new Date(value).toDateString());
    }
}