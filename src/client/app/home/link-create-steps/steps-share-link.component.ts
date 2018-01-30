import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { cast, FormGroupState, NgrxValueConverter, NgrxValueConverters, ResetAction, SetValueAction } from 'ngrx-forms';

import {CreateLinkDto} from "../../shared/entities";
import * as $ from "jquery";

@Component({
  selector: 'sd-steps-share-link',
  template: `
    <div class="create-link-form">
      <mat-form-field>
        <input matInput [(ngModel)]="shortPageUrl" readonly (click)="onShortUrlClick($event)" autofocus>
      </mat-form-field>
      <div class="share-btns copy-link-btn-color">
        <!--<a mat-raised-button color="primary" class="visit-btn" [href]="shortPageUrl" target="_blank">-->
        <!--VISIT LINK-->
        <!--<mat-icon>open_in_new</mat-icon>-->
        <!--</a>-->
        <share-button theme="material-dark" [button]="'copy'" [showText]="true" [size]="4" [url]="shortPageUrl"></share-button>
        <br><br>
        <share-buttons theme="material-dark" 
                       [include]="['facebook','twitter','whatsapp','email','linkedin','pinterest','telegram','google']"
                       [show]="8" 
                       [size]="4" 
                       [url]="shortPageUrl"></share-buttons>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepsShareLinkComponent {
  @Input() shortPageUrl: string;

  constructor() { }

  onShortUrlClick($event: MouseEvent) {
    $($event.srcElement).select();
  }
}
