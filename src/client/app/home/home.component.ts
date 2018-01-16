import { Component, OnInit } from '@angular/core';
import { NameListService } from '../shared/name-list/name-list.service';
import {AuthService, UserProfile} from "../auth/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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

  link: any = {
    url: undefined,
    title: undefined,
    description: undefined,
    ctaHeader: undefined,
    ctaUrl: undefined,
  };
  private profile: UserProfile;

  brandFormGroup: FormGroup;
  ctaFormGroup: FormGroup;
  linkFormGroup: FormGroup;

  constructor(private auth: AuthService,
              private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.auth.getProfile().subscribe(x => this.profile = x);


    this.brandFormGroup = this._formBuilder.group({
      name: ['', Validators.required]
    });
    this.ctaFormGroup = this._formBuilder.group({
      message: ['', Validators.required],
      buttonText: ['', Validators.required],
      buttonUrl: ['', Validators.required],
    });
    this.linkFormGroup = this._formBuilder.group({
      pageUrl: ['', Validators.required]
    });
  }


  shortUrl() {
      if (this.auth.isAuthenticated()) {
          this.createLink();
      } else {
          this.auth.login();
      }
  }

  private createLink() {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    const a = document.getElementById('urlhash');
    a.removeAttribute('href');
    a.innerText = '...';
    a.style.color = 'black';

    fetch('/api/urls', {
        method: 'POST',
        body: JSON.stringify(this.link),
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
