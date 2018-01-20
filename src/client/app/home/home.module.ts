import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import {PreviewComponent} from "./preview/preview.component";

@NgModule({
  imports: [
    HomeRoutingModule,
    SharedModule,

  ],
  declarations: [HomeComponent, PreviewComponent],
  exports: [HomeComponent, PreviewComponent],
  providers: []
})
export class HomeModule { }
