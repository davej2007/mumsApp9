import { Component, OnInit } from '@angular/core';
import { AUTHService } from 'src/app/components/AUTH-Modules/AUTH.service';

@Component({
  selector: 'welcome-to-the-site',
  templateUrl: './welcome-to-the-site.component.html',
  styleUrls: ['./welcome-to-the-site.component.css']
})
export class WelcomeToTheSiteComponent implements OnInit {

  constructor(
    public _AUTH:AUTHService
  ) { }

  ngOnInit(): void {
    console.log(this._AUTH.UserName)
  }

}
