import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AUTHService } from 'src/app/components/AUTH-Modules/AUTH.service';

@Component({
  selector: 'ebay-nav-bar',
  templateUrl: './ebay-nav-bar.component.html',
  styleUrls: ['./ebay-nav-bar.component.css']
})
export class EbayNavBarComponent implements OnInit {

  constructor(public _AUTH:AUTHService) { }

  ngOnInit(): void {
  }
  // Variables
  public envName = environment.name;
  public showMainNav : Boolean = true;
  
  toggleCollapse() {
    this.showMainNav = !this.showMainNav;
  }
}