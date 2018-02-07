import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AboutRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule, 
    AboutRoutingModule, 
    SharedModule
  ],
  declarations: [AdminComponent],
  exports: [AdminComponent]
})
export class AdminModule { }
