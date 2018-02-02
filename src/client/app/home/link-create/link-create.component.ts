import {Component, ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {AuthService, UserProfile} from "../../auth/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {CreateLinkResultDto, CreateLinkDto} from "../../shared/entities";
import {MatStepper, MatStep} from "@angular/material";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {FormGroupState} from "ngrx-forms";
import {
  getChooseLinkForm, State, getSetupBrandForm, getSetupCtaForm, getShortPageUrl,
  getCta, getStepper, getErrorMessage
} from "./link-create.reducer";

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
  chooseLinkForm$: Observable<FormGroupState<CreateLinkDto>>;
  setupBrandForm$: Observable<FormGroupState<CreateLinkDto>>;
  setupCtaForm$: Observable<FormGroupState<CreateLinkDto>>;
  shortPageUrl$: Observable<string>;
  cta$: Observable<CreateLinkDto>;
  errorMessage$: Observable<string>;

  @ViewChild('formStepper') formStepper: MatStepper;
  @ViewChild('chooseLinkStep') chooseLinkStep: MatStep;
  @ViewChild('setupBrandStep') setupBrandStep: MatStep;
  @ViewChild('setupCtaStep') setupCtaStep: MatStep;
  @ViewChild('shareLinkStep') shareLinkStep: MatStep;

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
  }

  ngOnInit() {
    this._auth.getProfile().subscribe(x => this.profile = x);
  }

  ngAfterViewInit(): void {
    this._store.select(getStepper)
      .subscribe(x => {
          switch(x) {
            case 'choose-link':
              this.chooseLinkStep.select();
              break;
            case 'setup-brand':
              this.setupBrandStep.select();
              break;
            case 'setup-cta':
              this.setupCtaStep.select();
              break;
            case 'share-link':
              this.shareLinkStep.select();
              break;
          }
          this.formStepper._stateChanged();
      });
  }

  onSetupCtaSubmit() {
    // this._store.dispatch(new LinkCreate.SetupCtaAction(<LinkCreateDto> {
    //   message: this.ctaFormGroup.value.message,
    //   buttonText: this.ctaFormGroup.value.buttonText,
    //   buttonUrl: this._linkenizer(this.ctaFormGroup.value.buttonUrl),
    // }));

    //if (this._auth.isAuthenticated()) {
    // this.isLoading = true;
    // try {
    //   this._auth.login();
    //   await this._createLinkInternal();
    //   this.formStepper.next();
    // } catch(e) {
    //   this.submitError = 'An error has occurred, please try again later';
    // }
    // this.isLoading = false;
    //} else {
    //    this._auth.login();
    //}
  }

}
