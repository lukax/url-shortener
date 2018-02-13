import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { cast, FormGroupState, NgrxValueConverter, NgrxValueConverters, ResetAction, SetValueAction } from 'ngrx-forms';

import {CreateLinkViewModel} from "../../shared/entities";
import {LinkCreate} from "../link-create/link-create.actions";

@Component({
  selector: 'sd-steps-setup-brand',
  template: `
    <form class="create-link-form" [ngrxFormState]="formState" (submit)="submit()">
      <mat-form-field>
        <input matInput placeholder="Título para sua chamada" [ngrxFormControlState]="formState.controls.name">
        <mat-hint>Escolha um título para sua chamada</mat-hint>
        <mat-error *ngIf="formState.errors._name?.required">
          Precisamos que indique um título para sua chamada.
        </mat-error>
      </mat-form-field>
      <br>
      
      <button mat-raised-button color="primary" class="continue-btn"
              [disabled]="formState.isValidationPending 
                          || (formState.isInvalid && formState.isSubmitted) 
                          || formState.userDefinedProperties.isLoading">
        CONTINUE
      </button>
      <br>
      
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepsSetupBrandComponent {
  @Input() formState: FormGroupState<CreateLinkViewModel>;
  submittedValue: CreateLinkViewModel;

  constructor(private actionsSubject: ActionsSubject) { }

  submit() {
    if (this.formState.isInvalid) {
      return;
    }

    this.submittedValue = this.formState.value;
    this.actionsSubject.next(new LinkCreate.SubmitSetupBrandAction(this.submittedValue));
  }
}
