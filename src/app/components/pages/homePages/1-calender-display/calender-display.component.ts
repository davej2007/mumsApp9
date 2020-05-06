import { Component, OnInit } from '@angular/core';
import { IDISPLAYDATE } from 'src/app/components/custom/interface/state';
import { Months, Days, aDayIs, DateValue, aWeekIs } from 'src/app/components/custom/directive/functions';

export interface IDAY {
  date  	: number,
  visit   : Array<string>,
  agent   : Array<string>,
  bins    : Array<string>
}

@Component({
  selector: 'calender-display',
  templateUrl: './calender-display.component.html',
  styleUrls: ['./calender-display.component.css']
})
export class CalenderDisplayComponent implements OnInit {

  constructor() { }

  public DisplayShow  : Array<IDISPLAYDATE>= [];
  public DisplayMonth : IDISPLAYDATE;
  public MONTHS       : Array<string> = Months;
  public DAYS         : Array<string> = Days;
  public monthBegins  : number;
  public monthEnds    : number;
  public WEEKS        : Array<any> = [];
  public TODAY        : number;
  
  ngOnInit(): void {
    let date:Date = new Date();
    let currentDay:number = date.getDate()
    let currentmonth:number = date.getMonth();
    let currentyear:number = date.getUTCFullYear();
    this.DisplayMonth = {month: currentmonth, year:currentyear};
    this.TODAY = DateValue(new Date(currentyear, currentmonth, currentDay));
    
    let y:number= 2019;
    let m:number = 10;
    while ( currentyear>y || currentmonth>=m ) {
      this.DisplayShow.push({month:m,year:y});
      if(m==11){
        m=0;y++
      } else {
        m++
      }
    }
    for(var i=0; i<4;i++){
      this.DisplayShow.push({month:m,year:y});
      if(m==11){
        m=0;y++
      } else {
        m++
      }
    }
    this.reloadMonth(this.DisplayMonth)
  }
  checkDisplayDate(en:any){
    if(this.DisplayMonth.month == en.month && this.DisplayMonth.year == en.year){
      return true
    } else {
      return false
    }
  }
  getCustomCss(date:number){
    if (date==this.TODAY) return 'today'
    if (date >= this.monthBegins && date <=this.monthEnds) return 'normal'
    return 'NotCurrent'
  }
  reloadMonth(start:IDISPLAYDATE){
    this.WEEKS = [];
    let finish:IDISPLAYDATE  = { month:start.month+1, year:start.year }
    let startDate = new Date(start.year, start.month);
    this.monthBegins = DateValue(startDate)
    if(start.month==11) finish = { month:0, year:start.year + 1 }
    this.monthEnds = DateValue(new Date(finish.year, finish.month)) - aDayIs;
    let wc = this.monthBegins - startDate.getDay() * aDayIs;;
    while (wc <= this.monthEnds){
      let weekData = { weekCommence:wc, Days:[] }
      for(let i = 0; i < 7; i++){
        let dayData:IDAY = { date:wc+i*aDayIs, visit:[], agent:[], bins:[]}
        dayData.visit.push('Help')
        weekData.Days.push(dayData)
      }
      this.WEEKS.push(weekData);
      wc = wc + aWeekIs;      
    }
  }
}
