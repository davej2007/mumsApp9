import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { AUTHService } from './AUTH.service';
 
export function initilizeSettings(_AUTH: AUTHService) {
    return () => _AUTH.initilizeSettings();
}
 
@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [
    AUTHService,
    { provide: APP_INITIALIZER,
      useFactory: initilizeSettings,
      deps: [AUTHService],
      multi: true }
  ]
})

export class AUTHModule { }