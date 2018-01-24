import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService, UserProfile} from "../auth/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {LinkCreatedDto, LinkCreateDto} from "../core/LinkDto";
import {AuthHttp} from "angular2-jwt";
import {Headers, Http} from '@angular/http';
import * as $ from 'jquery';
import {MatStepper} from "@angular/material";

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit {

  brandFormGroup: FormGroup;
  ctaFormGroup: FormGroup;
  linkFormGroup: FormGroup;
  pageUrl: SafeResourceUrl;
  shortPageUrl: string;
  shortUrlPrefix = 'http://localhost:3000/';
  isLoading = false;
  submitError: string;

  @ViewChild('formStepper') formStepper: MatStepper;

  private profile: UserProfile;
  private readonly URL_REGEXP = new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);

  constructor(private _auth: AuthService,
              private _authHttp: AuthHttp,
              private _http: Http,
              private _formBuilder: FormBuilder,
              private _sanitization: DomSanitizer) {}

  ngOnInit() {
    this._auth.getProfile().subscribe(x => this.profile = x);

    this._buildForm(new LinkCreateDto());
  }


  async onCtaFormGroupSubmit() {
      //if (this._auth.isAuthenticated()) {
        this.isLoading = true;
        try {
          await this._createLinkInternal();
          this.formStepper.next();
        } catch(e) {
          this.submitError = 'An error has occurred, please try again later';
        }
        this.isLoading = false;
        //} else {
      //    this._auth.login();
      //}
  }

  onPageUrlChange() {
    if(this.linkFormGroup && this.linkFormGroup.value.pageUrl) {
      this.pageUrl = this._sanitizeUrl(this.linkFormGroup.value.pageUrl);
    }
  }

  onShortUrlClick($event: MouseEvent) {
    $($event.srcElement).select();
  }

  getLink(): LinkCreateDto {
    const link = new LinkCreateDto();
    link.name = this.brandFormGroup.value.name;
    link.message = this.ctaFormGroup.value.message;
    link.buttonText = this.ctaFormGroup.value.buttonText;
    link.buttonUrl = this._linkenizer(this.ctaFormGroup.value.buttonUrl);
    link.pageUrl = this._linkenizer(this.linkFormGroup.value.pageUrl);
    return link;
  }

  private _sanitizeUrl(url: string) {
    if (this.URL_REGEXP.test(url)) {
      return this._sanitization.bypassSecurityTrustResourceUrl(this._linkenizer(this.linkFormGroup.value.pageUrl));
    }
    return null;
  }

  private _buildForm(link: LinkCreateDto) {
    this.brandFormGroup = this._formBuilder.group({
      name: [link.name, Validators.required]
    });
    this.ctaFormGroup = this._formBuilder.group({
      message: [link.message, Validators.required],
      buttonText: [link.buttonText, Validators.required],
      buttonUrl: [link.buttonUrl, [Validators.required, Validators.pattern(this.URL_REGEXP)]]
    });
    this.linkFormGroup = this._formBuilder.group({
      pageUrl: [link.pageUrl, [Validators.required, Validators.pattern(this.URL_REGEXP)]]
    });
  }

  private async _createLinkInternal() {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    const result = await this._http.post('/api/links', JSON.stringify(this.getLink()),
      { headers: headers })
      .map(res => res.json())
      .toPromise();
    this.shortPageUrl = this.shortUrlPrefix + result.hash;
  }

  private _linkenizer(link: string): string {
    return (link != null)
      ? (link.indexOf('://') === -1) ? 'http://' + link : link
      : null;
  }


}
