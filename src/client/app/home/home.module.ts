import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import {PreviewComponent} from "./preview/preview.component";
import {ShareButtonsModule} from "@ngx-share/buttons";
import {CtaStdButtonComponent} from "./cta-std-button/cta-std-button.component";

@NgModule({
  imports: [
    HomeRoutingModule,
    SharedModule,

    ShareButtonsModule
  ],
  declarations: [
    HomeComponent,
    PreviewComponent,
    CtaStdButtonComponent,
  ],
  exports: [
    HomeComponent,
    PreviewComponent,
    CtaStdButtonComponent,
  ],
  providers: []
})
export class HomeModule { }
