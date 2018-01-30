import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { cast, FormGroupState, NgrxValueConverter, NgrxValueConverters, ResetAction, SetValueAction } from 'ngrx-forms';

import {CreateLinkDto} from "../../shared/entities";

@Component({
  selector: 'sd-steps-choose-link',
  template: `
    <form class="create-link-form" [ngrxFormState]="formState" (submit)="onChooseLinkSubmit()">
      <mat-form-field>
        <input matInput placeholder="Page URL" [ngrxFormControlState]="formState.controls.pageUrl">
        <mat-hint>Enter a link to an article</mat-hint>
        <mat-error *ngIf="formState.errors._pageUrl?.required">
          A page URL is required
        </mat-error>
        <mat-error *ngIf="formState.errors._pageUrl?.$exists">
          This page URL is not supported :(
        </mat-error>
        <mat-progress-spinner class="input-spinner" mode="indeterminate" color="primary" diameter="20" span 
                              *ngIf="formState.isValidationPending"></mat-progress-spinner>
      </mat-form-field>
      <br>
      <div>
        <button mat-raised-button color="primary" class="continue-btn">
          CONTINUE
          <mat-progress-spinner mode="indeterminate" color="accent" diameter="20" 
                                *ngIf="formState.controls.isLoading"></mat-progress-spinner>
        </button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepsChooseLinkComponent {
  @Input() formState: FormGroupState<CreateLinkDto>;
  submittedValue: CreateLinkDto;

  constructor(private actionsSubject: ActionsSubject) { }

  submit() {
    if (this.formState.isInvalid) {
      return;
    }

    this.submittedValue = this.formState.value;
  }
}
