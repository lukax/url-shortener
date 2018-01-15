import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AboutRoutingModule } from './admin-routing.module';

@NgModule({
  imports: [CommonModule, AboutRoutingModule],
  declarations: [AdminComponent],
  exports: [AdminComponent]
})
export class AdminModule { }
