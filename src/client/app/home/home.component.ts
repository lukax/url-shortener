import { Component, OnInit } from '@angular/core';
import { NameListService } from '../shared/name-list/name-list.service';
import {AuthService, UserProfile} from "../auth/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

export interface Link {
  pageUrl: string;
  name: string;
  message: string;
  buttonText: string;
  buttonUrl: string;
}

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

  private profile: UserProfile;

  brandFormGroup: FormGroup;
  ctaFormGroup: FormGroup;
  linkFormGroup: FormGroup;

  pageUrl: SafeResourceUrl;
  shortPageUrl: string;

  constructor(private _auth: AuthService,
              private _formBuilder: FormBuilder,
              private _sanitization: DomSanitizer) {}

  ngOnInit() {
    this._auth.getProfile().subscribe(x => this.profile = x);

    this.pageUrl = "";
    this.shortPageUrl = "";

    const link: Link = {
      pageUrl: "",
      name: "",
      message: "",
      buttonText: "",
      buttonUrl: "",
    };
    this.buildForm(link);
  }


  createLink() {
      if (this._auth.isAuthenticated()) {
          this.createLinkInternal();
      } else {
          this._auth.login();
      }
  }

  onPageUrlChange() {
    this.pageUrl = this.getPageUrl();
  }

  getPageUrl() {
    const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if(this.linkFormGroup &&
        this.linkFormGroup.value.pageUrl &&
        regex.test('http://' + this.linkFormGroup.value.pageUrl)){
      return this._sanitization.bypassSecurityTrustResourceUrl('http://' + this.linkFormGroup.value.pageUrl);
    }
    return null;
  }

  private buildForm(link: Link) {
    this.brandFormGroup = this._formBuilder.group({
      name: [link.name, Validators.required]
    });
    this.ctaFormGroup = this._formBuilder.group({
      message: [link.message, Validators.required],
      buttonText: [link.buttonText, Validators.required],
      buttonUrl: [link.buttonUrl, Validators.required],
    });
    this.linkFormGroup = this._formBuilder.group({
      pageUrl: [link.pageUrl, Validators.required]
    });
  }

  private createLinkInternal() {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    const a = document.getElementById('urlhash');
    a.removeAttribute('href');
    a.innerText = '...';
    a.style.color = 'black';


    fetch('/api/urls', {
        method: 'POST',
        body: JSON.stringify(Object.assign({},this.brandFormGroup.value, this.ctaFormGroup.value, this.linkFormGroup.value)),
        headers: headers
    }).then(function(res) {
        if (res.status === 200) {
            res.json().then(function(json) {
                a.setAttribute('href', json);
                a.innerText = window.location.href + json;
            });
        } else {
            a.removeAttribute('href');
            a.innerText = 'invalid url :(';
            a.style.color = 'red';
        }
    }).catch(function(err) {
        a.removeAttribute('href');
        a.innerText = 'connection error, please try again';
        a.style.color = 'red';
    });

  }




}
