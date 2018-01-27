import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService, UserProfile} from "../../auth/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {CreateLinkResultDto, CreateLinkDto} from "../../shared/entities";
import * as $ from 'jquery';
import {MatStepper} from "@angular/material";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {FormGroupState} from "ngrx-forms";
import {LinkService} from '../index';
import {State} from "./link-create.reducer";

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-link-create',
  templateUrl: 'link-create.component.html',
  styleUrls: ['link-create.component.css'],
})
export class CreateLinkComponent implements OnInit {

  pageUrl: SafeResourceUrl;
  shortPageUrl: string;
  shortUrlPrefix = 'http://localhost:3000/';
  isLoading = false;
  submitError: string;


  formState$: Observable<FormGroupState<CreateLinkDto>>;

  @ViewChild('formStepper') formStepper: MatStepper;

  private profile: UserProfile;

  constructor(private _auth: AuthService,
              private _formBuilder: FormBuilder,
              private _sanitization: DomSanitizer,
              private _store: Store<State>) {}

  ngOnInit() {
    this._auth.getProfile().subscribe(x => this.profile = x);

    this.formState$ = this._store.select(x => x.linkCreate.formState);
  }


  onChooseLinkSubmit() {
    // this._store.dispatch(new LinkCreate.ChoosePageLinkAction(<LinkCreateDto>{
    //   pageUrl: this._linkenizer(this.linkFormGroup.value.pageUrl)
    // }));
  }
  onSetupBrandSubmit() {
    // this._store.dispatch(new LinkCreate.SetupBrandAction(<LinkCreateDto>{
    //   name: this.brandFormGroup.value.name
    // }));
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

  onShortUrlClick($event: MouseEvent) {
    $($event.srcElement).select();
  }

  // getLink(): LinkCreateDto {
  //   const link = new LinkCreateDto();
  //   link.name = this.brandFormGroup.value.name;
  //   link.message = this.ctaFormGroup.value.message;
  //   link.buttonText = this.ctaFormGroup.value.buttonText;
  //   link.buttonUrl = this._linkenizer(this.ctaFormGroup.value.buttonUrl);
  //   link.pageUrl = this._linkenizer(this.linkFormGroup.value.pageUrl);
  //   return link;
  // }

  // private _sanitizeUrl(url: string) {
  //   if (this.URL_REGEXP.test(url)) {
  //     return this._sanitization.bypassSecurityTrustResourceUrl(this._linkService.linkenizer(url));
  //   }
  //   return null;
  // }

  // private _buildForm(link: LinkCreateDto) {
  //   this.brandFormGroup = this._formBuilder.group({
  //     name: [link.name, Validators.required]
  //   });
  //   this.ctaFormGroup = this._formBuilder.group({
  //     message: [link.message, Validators.required],
  //     buttonText: [link.buttonText, Validators.required],
  //     buttonUrl: [link.buttonUrl, [Validators.required, Validators.pattern(this.URL_REGEXP)]]
  //   });
  //   this.linkFormGroup = this._formBuilder.group({
  //     pageUrl: [link.pageUrl, [Validators.required, Validators.pattern(this.URL_REGEXP)]]
  //   });
  // }

  // private async _createLinkInternal() {
  //   const headers = new Headers();
  //   headers.set('Content-Type', 'application/json');
  //
  //   const result = await this._http.post('/api/links', JSON.stringify(this.getLink()),
  //     { headers: headers })
  //     .map(res => res.json())
  //     .toPromise();
  //   this.shortPageUrl = this.shortUrlPrefix + result.hash;
  // }



}
