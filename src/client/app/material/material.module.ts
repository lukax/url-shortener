import { NgModule } from '@angular/core';
import {
  MAT_PLACEHOLDER_GLOBAL_OPTIONS, MatAutocompleteModule,
  MatButtonModule, MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule, MatChipsModule,
  MatDatepickerModule, MatDialogModule, MatExpansionModule, MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule, MatMenuModule,
  MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule,
  MatRadioModule, MatRippleModule,
  MatSelectModule,
  MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatStepperModule,
  MatTableModule,
  MatTabsModule, MatToolbarModule, MatTooltipModule,
} from '@angular/material';

import { CustomErrorStateMatcherDirective } from './error-state-matcher';
import { NgrxMatSelectValueAccessor } from './mat-select-value-accessor';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

const MATERIAL_COMPONENTS = [
  BrowserAnimationsModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
];

@NgModule({
  imports: [
    ...MATERIAL_COMPONENTS
  ],
  declarations: [
    NgrxMatSelectValueAccessor,
    CustomErrorStateMatcherDirective,
  ],
  exports: [
    ...MATERIAL_COMPONENTS,
    NgrxMatSelectValueAccessor,
    CustomErrorStateMatcherDirective
  ],
  providers: [
    //{ provide: MAT_PLACEHOLDER_GLOBAL_OPTIONS, useValue: { float: 'always' } }
  ]
})
export class MaterialModule { }


