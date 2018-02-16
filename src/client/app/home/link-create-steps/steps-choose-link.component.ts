import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {ActionsSubject, Store} from '@ngrx/store';
import { cast, FormGroupState, NgrxValueConverter, NgrxValueConverters, ResetAction, SetValueAction } from 'ngrx-forms';

import {CreateLinkViewModel} from "../../shared/models";
import {LinkCreate} from "../link-create/link-create.actions";
import {State} from "../../app.reducer";

@Component({
  selector: 'sd-steps-choose-link',
  template: `
    <form class="create-link-form" [ngrxFormState]="formState" (submit)="submit()">
      <mat-form-field>
        <input matInput placeholder="Endereço do conteúdo" [ngrxFormControlState]="formState.controls.pageUrl">
        <mat-hint>Cole o link aqui. (ex: medium.com)</mat-hint>
        <mat-error *ngIf="formState.errors._pageUrl?.required">
          Para avançarmos você precisa indicar um link
        </mat-error>
        <mat-error *ngIf="formState.errors._pageUrl?.$exists || formState.errors._pageUrl?.pattern">
          Hummmm nos desculpe mas ainda não conseguimos criar um Jeit.in dessa página :(
        </mat-error>
        <mat-progress-spinner class="input-spinner" mode="indeterminate" color="primary" diameter="20" span 
                              *ngIf="formState.isValidationPending"></mat-progress-spinner>
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
export class StepsChooseLinkComponent {
  @Input() formState: FormGroupState<CreateLinkViewModel>;

  constructor(private actionsSubject: ActionsSubject) { }

  submit() {
    if (this.formState.isInvalid) {
      return;
    }

    this.actionsSubject.next(new LinkCreate.SubmitPageUrlAction(this.formState.value));
  }
}
