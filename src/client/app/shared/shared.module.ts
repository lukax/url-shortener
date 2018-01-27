import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ToolbarComponent } from './toolbar/toolbar.component';
import {MaterialModule} from "../material/material.module";


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [ToolbarComponent],
  exports: [
    ToolbarComponent,
    CommonModule,
    MaterialModule,

    FormsModule,
    ReactiveFormsModule,
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
