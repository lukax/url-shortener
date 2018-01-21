import { Component, OnInit } from '@angular/core';
import {AuthService, UserProfile} from "../auth/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {LinkDto} from "../core/LinkDto";
import {AuthHttp} from "angular2-jwt";
import {Headers, Http} from '@angular/http';

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

  private profile: UserProfile;
  private readonly URL_REGEXP = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);

  constructor(private _auth: AuthService,
              private _authHttp: AuthHttp,
              private _http: Http,
              private _formBuilder: FormBuilder,
              private _sanitization: DomSanitizer) {}

  ngOnInit() {
    this._auth.getProfile().subscribe(x => this.profile = x);

    this.pageUrl = "";
    this.shortPageUrl = "";

    const link: LinkDto = {
      pageUrl: "",
      name: "",
      message: "",
      buttonText: "",
      buttonUrl: "",
    };
    this.buildForm(link);
  }


  createLink() {
      //if (this._auth.isAuthenticated()) {
          this.createLinkInternal();
      //} else {
      //    this._auth.login();
      //}
  }

  onPageUrlChange() {
    this.pageUrl = this.getPageUrl();
  }

  getPageUrl() {
    const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if(this.linkFormGroup &&
        this.linkFormGroup.value.pageUrl &&
        regex.test('http://' + this.linkFormGroup.value.pageUrl)) {
      return this._sanitization.bypassSecurityTrustResourceUrl('http://' + this.linkFormGroup.value.pageUrl);
    }
    return null;
  }

  private buildForm(link: LinkDto) {
    this.brandFormGroup = this._formBuilder.group({
      name: [link.name, Validators.required]
    });
    this.ctaFormGroup = this._formBuilder.group({
      message: [link.message, Validators.required],
      buttonText: [link.buttonText, Validators.required],
      buttonUrl: [link.buttonUrl, Validators.compose([Validators.required, Validators.pattern(this.URL_REGEXP)])]
    });
    this.linkFormGroup = this._formBuilder.group({
      pageUrl: [link.pageUrl, Validators.compose([Validators.required, Validators.pattern(this.URL_REGEXP)])]
    });
  }

  private createLinkInternal() {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    this.shortPageUrl = '...';

    this._http.post('/api/links',
        JSON.stringify(Object.assign({},this.brandFormGroup.value, this.ctaFormGroup.value, this.linkFormGroup.value)),
        { headers: headers })
      .subscribe(res => {
          if (res.status === 200) {
            res.json().then((json: any) => {
              this.shortPageUrl = 'https://urlftw.herokuapp.com/5ba10';
            });
          } else {
            this.shortPageUrl = 'error!';
          }
      }, err => {
        this.shortPageUrl = 'connection error, please try again!';
      });

  }




}
