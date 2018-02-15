import {Component, ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {AuthService, UserProfile} from "../../auth/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {CreateLinkResultViewModel, CreateLinkViewModel, PageMetadataViewModel} from "../../shared/models";
import {MatStepper, MatStep} from "@angular/material";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {FormGroupState} from "ngrx-forms";
import {
  getChooseLinkForm, State, getSetupBrandForm, getSetupCtaForm, getShortPageUrl,
  getCta, getStepper, getErrorMessage, getPreviewPageUrl, getIsCompleted
} from "./link-create.reducer";
import {Auth} from "../../auth/auth.actions";
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { LinkCreate } from './link-create.actions';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-link-create',
  templateUrl: 'link-create.component.html',
  styleUrls: ['link-create.component.css'],
})
export class CreateLinkComponent implements OnInit, AfterViewInit {
  chooseLinkForm$: Observable<FormGroupState<CreateLinkViewModel>>;
  setupBrandForm$: Observable<FormGroupState<CreateLinkViewModel>>;
  setupCtaForm$: Observable<FormGroupState<CreateLinkViewModel>>;
  shortPageUrl$: Observable<string>;
  cta$: Observable<CreateLinkViewModel>;
  errorMessage$: Observable<string>;
  previewPageUrl$: Observable<string>;
  
  @ViewChild('formStepper') formStepper: MatStepper;
  stepperIndexDict: LinkCreate.StepperTypes[] = ['choose-link', 'setup-brand', 'setup-cta', 'share-link'];

  private profile: UserProfile;

  constructor(private _auth: AuthService,
              private _formBuilder: FormBuilder,
              private _store: Store<State>) {

    this.chooseLinkForm$ = this._store.select(getChooseLinkForm);
    this.setupBrandForm$ = this._store.select(getSetupBrandForm);
    this.setupCtaForm$ = this._store.select(getSetupCtaForm);
    this.shortPageUrl$ = this._store.select(getShortPageUrl);
    this.cta$ = this._store.select(getCta);
    this.errorMessage$ = this._store.select(getErrorMessage);
    this.previewPageUrl$ = this._store.select(getPreviewPageUrl);
  }

  ngOnInit() {
    this._auth.getProfile().subscribe(x => this.profile = x);
    this._store.dispatch(new Auth.LoginAction());
  }

  ngAfterViewInit(): void {
    this._store.select(getStepper)
      .subscribe(x => {
          this.formStepper.selectedIndex = this.stepperIndexDict.indexOf(x);
          this.formStepper._stateChanged();
      });
  }

  onStepperSelectionChange($event: StepperSelectionEvent) {
    this._store.dispatch(new LinkCreate.SelectedStepAction(this.stepperIndexDict[$event.selectedIndex]));
  }

}
