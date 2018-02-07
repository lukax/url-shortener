import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { cast, FormGroupState, NgrxValueConverter, NgrxValueConverters, ResetAction, SetValueAction } from 'ngrx-forms';

import {CreateLinkDto} from "../../shared/entities";
import {LinkCreate} from "../link-create/link-create.actions";

@Component({
  selector: 'sd-steps-setup-brand',
  template: `
    <form class="create-link-form" [ngrxFormState]="formState" (submit)="submit()">
      <mat-form-field>
        <input matInput placeholder="Name" [ngrxFormControlState]="formState.controls.name">
        <mat-hint>A nice attention grabbing header!</mat-hint>
      </mat-form-field>
      <br>
      
      <button mat-raised-button color="primary" class="continue-btn"
              [disabled]="formState.isValidationPending 
                          || (formState.isInvalid && formState.isSubmitted) 
                          || formState.userDefinedProperties.isLoading">
        CONTINUE
      </button>
      
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepsSetupBrandComponent {
  @Input() formState: FormGroupState<CreateLinkDto>;
  submittedValue: CreateLinkDto;

  constructor(private actionsSubject: ActionsSubject) { }

  submit() {
    if (this.formState.isInvalid) {
      return;
    }

    this.submittedValue = this.formState.value;
    this.actionsSubject.next(new LinkCreate.SubmitSetupBrandAction(this.submittedValue));
  }
}
