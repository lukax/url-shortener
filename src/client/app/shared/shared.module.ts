import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ToolbarComponent } from './toolbar/toolbar.component';
import {MaterialModule} from "../material/material.module";
import {LoadingSpinnerComponent} from "./loading-spinner/loading-spinner.component";


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    ToolbarComponent,
    LoadingSpinnerComponent,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,

    ToolbarComponent,
    LoadingSpinnerComponent,

  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
