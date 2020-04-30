import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/components/services/auth/auth.service';
import { AUTHService } from 'src/app/components/AUTH-Modules/AUTH.service';
import { Router } from '@angular/router';

@Component({
  selector: 'initilize-local-storage',
  templateUrl: './initilize-local-storage.component.html',
  styleUrls: ['./initilize-local-storage.component.css']
})
export class InitilizeLocalStorageComponent implements OnInit {

  constructor(
    public _auth:AuthService,
    public _AUTH:AUTHService,
    public _Router:Router
  ) { }
  // variables
    public name:String = null;
    public processing:Boolean = false;
    errorMsg:String = '';
    successMsg:String = '';

  ngOnInit(): void {
  }
  select(selected:String){
    this.processing = true;
    if (selected == null){
      this.processing = false;
    } else {
      this._auth.initilizeLocalTokens(selected).subscribe(
        res=>{
          if(!res.success){
            this.errorMsg = res.error;
            setTimeout(()=>{
              this.errorMsg = '';
              this.processing = false;
              this.name = '';
            }, 2000);
          } else {
            this._AUTH.storeLocalVariables(res.token);
            this.successMsg = 'Welcome '+ res.user;
            setTimeout(()=>{
              this.successMsg = 'Re Directing ......';
              this._Router.navigateByUrl('/welcome');
            },2000)
          }
        },
        err =>  {
          alert('Server Error : '+err.message+' If this continues Please contact Systems.');
        }
        
      )
    }
  }
}
