import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { cast, FormGroupState, NgrxValueConverter, NgrxValueConverters, ResetAction, SetValueAction } from 'ngrx-forms';

import {CreateLinkViewModel} from "../../shared/entities";
import * as $ from "jquery";
import {LinkCreate} from "../link-create/link-create.actions";
import NewLinkAction = LinkCreate.NewLinkAction;

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
        <share-button theme="material-dark" text="Copiar o link" 
                      [button]="'copy'" [showText]="true" [size]="4" [url]="shortPageUrl"></share-button>
        <br><br><br>
        <share-buttons theme="material-dark" 
                       [include]="['facebook','twitter','whatsapp','email','linkedin','pinterest','telegram','google']"
                       [show]="8" 
                       [size]="4" 
                       [url]="shortPageUrl"></share-buttons>

        <!--button mat-raised-button class="new-link-btn" (click)="newLink()">
          NEW LINK
        </button-->
        
      </div>
    </div>
  `,
  styles: [` 
      .new-link-btn {
        /*width: 100%;*/
        margin-top: 50px;
      }
      .share-btns share-button {
        margin-left: -1px;
        margin-top: -15px;
      }
      .share-btns share-buttons {
        margin-left: -6px;
        margin-top: 40px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepsShareLinkComponent {
  @Input() shortPageUrl: string;

  constructor(private actionsSubject: ActionsSubject) { }

  onShortUrlClick($event: MouseEvent) {
    $($event.srcElement).select();
  }

  newLink() {
    this.actionsSubject.next(new NewLinkAction());
  }

}
