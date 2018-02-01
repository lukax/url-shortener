import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { cast, FormGroupState, NgrxValueConverter, NgrxValueConverters, ResetAction, SetValueAction } from 'ngrx-forms';

import {CreateLinkDto} from "../../shared/entities";
import {LinkCreate} from "../link-create/link-create.actions";

@Component({
  selector: 'sd-steps-setup-cta',
  template: `
    <form class="create-link-form" [ngrxFormState]="formState" (submit)="submit()">
      <mat-form-field>
        <input matInput placeholder="Message" [ngrxFormControlState]="formState.controls.message">
        <mat-hint>A descriptive sentence for the Call To Action (CTA)</mat-hint>
      </mat-form-field>
      <br>
      <mat-form-field>
        <input matInput placeholder="Button Text" [ngrxFormControlState]="formState.controls.buttonText">
        <mat-hint>What will your button say?</mat-hint>
      </mat-form-field>
      <br>
      <mat-form-field>
        <input matInput placeholder="Button URL" [ngrxFormControlState]="formState.controls.buttonUrl">
        <mat-hint>Where will your button go?</mat-hint>
      </mat-form-field>
      <br>
      
      <button mat-raised-button color="primary" class="continue-btn"
              [disabled]="formState.isValidationPending || formState.isInvalid && formState.isSubmitted">
        CONTINUE
        <mat-progress-spinner mode="indeterminate" color="accent" diameter="20" 
                              *ngIf="formState.userDefinedProperties.isLoading"></mat-progress-spinner>
      </button>

      <br>
      <br>
      <mat-error>
        <small>{{ errorMessage }}</small>
      </mat-error>
      
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepsSetupCtaComponent {
  @Input() formState: FormGroupState<CreateLinkDto>;
  @Input() errorMessage: string;
  submittedValue: CreateLinkDto;

  constructor(private actionsSubject: ActionsSubject) { }

  submit() {
    if (this.formState.isInvalid) {
      return;
    }

    this.submittedValue = this.formState.value;
    this.actionsSubject.next(new LinkCreate.SubmitSetupCtaAction(this.submittedValue));
  }
}
