import { Component, OnInit } from '@angular/core';
import { IDISPLAYDATE } from 'src/app/components/custom/interface/state';
import { Months, Days, aDayIs, DateValue, aWeekIs } from 'src/app/components/custom/directive/functions';
import { IVISIT } from 'src/app/components/custom/interface/visit';
import { ActivatedRoute } from '@angular/router';
import { element } from 'protractor';

export interface IDAY {
  date  	: number,
  visit   : Array<{id:String, name:String}>,
  agent   : Array<{id:String, time:String}>,
  bins    : Array<{id:String, type:String}>
}

@Component({
  selector: 'calender-display',
  templateUrl: './calender-display.component.html',
  styleUrls: ['./calender-display.component.css']
})
export class CalenderDisplayComponent implements OnInit {

  constructor(
    private activatedRoute:ActivatedRoute) { }

  public DisplayShow  : Array<IDISPLAYDATE>= [];
  public DisplayMonth : IDISPLAYDATE;
  public MONTHS       : Array<string> = Months;
  public DAYS         : Array<string> = Days;
  public monthBegins  : number;
  public monthEnds    : number;
  public WEEKS        : Array<any> = [];
  public TODAY        : number;
  public VISITS       : Array<IVISIT>;
  
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
    this.activatedRoute.data.subscribe(
      data=>{
        if(data.info.success){
          this.VISITS = data.info.visits;
        } else {
          alert(data.message)
        }
      },
      err =>  {
        alert('Server Error : '+err.message+' If this continues Please contact Systems.');
      }
    )
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
  getCustomColor(type:String){
    console.log(type)
    if(type=='Dave') return 'dave'
    if(type=='Jacky') return 'jacky'
    if(type=='Andrew') return 'andrew'
    if(type=='Recycling') return 'recycling'
    if(type=='Black Bins & Recycling') return 'black'

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
        let date = wc+i*aDayIs;
        let dayData:IDAY = { date:date, visit:[], agent:[], bins:[]}
        let found = this.FindEntries(this.VISITS, date)
        if (found.length!==0) {
          found.map(element => {
            if(element.type == 1) dayData.visit.push({id:element._id, name:element.home.by})
            if(element.type == 2) dayData.agent.push({id:element._id, time:element.agent.time})
            if(element.type == 3) dayData.bins.push({id:element._id, type:element.bins.type})
          })
        }
        weekData.Days.push(dayData)
      }
      this.WEEKS.push(weekData);
      wc = wc + aWeekIs;      
    }
    console.log(this.WEEKS)
  }
  FindEntries = function(visits:Array<IVISIT>, date:Number) {
    let result:Array<IVISIT> = [];
    visits.map(element => {
      if(element.date == date) result.push(element)
    })
    return result;
  }
}

