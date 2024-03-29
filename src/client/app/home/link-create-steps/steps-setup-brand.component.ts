import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { cast, FormGroupState, NgrxValueConverter, NgrxValueConverters, ResetAction, SetValueAction } from 'ngrx-forms';

import {CreateLinkViewModel} from "../../shared/models";
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
      <mat-form-field>
        <input matInput placeholder="Mensagem" [ngrxFormControlState]="formState.controls.message">
        <mat-hint>Uma descrição para sua "chamada".</mat-hint>
        <mat-error *ngIf="formState.errors._message?.required">
          Ela é um complemento ao título e deve levar o visitante a clicar no botão da chamada.
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

  constructor(private actionsSubject: ActionsSubject) { }

  submit() {
    if (this.formState.isInvalid) {
      return;
    }

    this.actionsSubject.next(new LinkCreate.SubmitSetupBrandAction(this.formState.value));
  }
}
