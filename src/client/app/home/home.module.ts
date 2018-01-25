import {NgModule, Optional, SkipSelf} from '@angular/core';
import { CreateLinkComponent } from './components/link-create/link-create.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import {LinkPreviewComponent} from "./components/link-preview/link-preview.component";
import {ShareButtonsModule} from "@ngx-share/buttons";
import {CtaStdButtonComponent} from "./components/cta-std-button/cta-std-button.component";
import {SAMPLE_PROVIDERS} from "./services";
import {SampleModule} from "../ngrx/ngrx.module";

@NgModule({
  imports: [
    HomeRoutingModule,
    SharedModule,

    ShareButtonsModule
  ],
  declarations: [
    CreateLinkComponent,
    LinkPreviewComponent,
    CtaStdButtonComponent,
  ],
  providers: [
    ...SAMPLE_PROVIDERS
  ],
  exports: [
    CreateLinkComponent,
    LinkPreviewComponent,
    CtaStdButtonComponent,
  ],
})
export class HomeModule {

  constructor(@Optional() @SkipSelf() parentModule: SampleModule) {
    if (parentModule) {
      throw new Error('HomeModule already loaded; Import in root module only.');
    }
  }
}
