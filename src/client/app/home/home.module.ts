import {NgModule, Optional, SkipSelf} from '@angular/core';
import { CreateLinkComponent } from './link-create/link-create.component';
import { SharedModule } from '../shared/shared.module';
import {LinkPreviewBackgroundComponent} from "./link-preview-background/link-preview-background.component";
import {ShareButtonsModule} from "@ngx-share/buttons";
import {CtaStdButtonComponent} from "./cta-std-button/cta-std-button.component";
import {SERVICE_PROVIDERS} from "./services/index";
import {NgrxFormsModule} from "ngrx-forms";
import {RouterModule} from "@angular/router";
import {StoreModule} from "@ngrx/store";
import {reducer} from "./link-create/link-create.reducer";
import {EffectsModule} from "@ngrx/effects";
import {LinkCreateEffects} from "./link-create/link-create.effects";
import {StepsChooseLinkComponent} from "./link-create-steps/steps-choose-link.component";
import {StepsSetupBrandComponent} from "./link-create-steps/steps-setup-brand.component";
import {StepsSetupCtaComponent} from "./link-create-steps/steps-setup-cta.component";
import {StepsShareLinkComponent} from "./link-create-steps/steps-share-link.component";
import {LinkPreviewUrlComponent} from "./link-preview-url/link-preview-url.component";
import {LinkViewComponent} from "./link-view/link-view.component";
import {EmailPromptDialogComponent} from "../email-prompt/email-prompt.component";

@NgModule({
  imports: [
    SharedModule,
    ShareButtonsModule,
    NgrxFormsModule,
    RouterModule.forChild([
      { path: '', component: CreateLinkComponent },
      { path: ':pageHash', component: LinkViewComponent }
    ]),

    StoreModule.forFeature('linkCreate', reducer),
    EffectsModule.forFeature([LinkCreateEffects]),

  ],
  declarations: [
    CreateLinkComponent,
    LinkPreviewBackgroundComponent,
    LinkPreviewUrlComponent,
    CtaStdButtonComponent,

    StepsChooseLinkComponent,
    StepsSetupBrandComponent,
    StepsSetupCtaComponent,
    StepsShareLinkComponent,
    LinkViewComponent,

    EmailPromptDialogComponent
  ],
  entryComponents: [
    EmailPromptDialogComponent
  ],
  providers: [
    ...SERVICE_PROVIDERS
  ],
})
export class HomeModule {

  constructor(@Optional() @SkipSelf() parentModule: HomeModule) {
    if (parentModule) {
      throw new Error('HomeModule already loaded; Import in root module only.');
    }
  }
}
