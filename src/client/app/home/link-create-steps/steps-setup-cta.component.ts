import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';

import {CreateLinkViewModel} from "../../shared/models";
import {LinkCreate} from "../link-create/link-create.actions";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'sd-steps-setup-cta',
  template: `
    <form class="create-link-form" [ngrxFormState]="formState" (submit)="submit()">
      <mat-form-field>
        <input matInput placeholder="Mensagem" [ngrxFormControlState]="formState.controls.message">
        <mat-hint>Uma descrição para sua "chamada".</mat-hint>
        <mat-error *ngIf="formState.errors._message?.required">
          Ela é um complemento ao título e deve levar o visitante a clicar no botão da chamada.
        </mat-error>
      </mat-form-field>
      <br>
      <mat-form-field>
        <input matInput placeholder="Texto do botão" [ngrxFormControlState]="formState.controls.buttonText">
        <mat-hint>O que deve estar escrito no botão?</mat-hint>
        <mat-error *ngIf="formState.errors._buttonText?.required">
          Precisamos que indique um texto.
        </mat-error>
      </mat-form-field>
      <br>
      <mat-form-field>
        <input matInput placeholder="Link de destino" [ngrxFormControlState]="formState.controls.buttonUrl">
        <mat-hint>Para onde você quer levar o visitante quando ele clicar no botão da sua chamada? (ex: medium.com)</mat-hint>
        <mat-error *ngIf="formState.errors._buttonText?.required">
          Precisamos que indique um link de destino.
        </mat-error>
        <mat-error *ngIf="formState.errors._buttonText?.$exists || formState.errors._buttonText?.pattern">
          Ops! Não conseguimos direcionar visitantes para esse endereço :(
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
      
      <mat-error>
        <small><br>{{ errorMessage }}</small>
      </mat-error>
      
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepsSetupCtaComponent {
  @Input() formState: FormGroupState<CreateLinkViewModel>;
  @Input() errorMessage: string;

  constructor(private actionsSubject: ActionsSubject) { }

  submit() {
    if (this.formState.isInvalid) {
      return;
    }

    this.actionsSubject.next(new LinkCreate.SubmitSetupCtaAction(this.formState.value));
  }


}
