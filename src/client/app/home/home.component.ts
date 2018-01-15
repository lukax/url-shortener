import { Component, OnInit } from '@angular/core';
import { NameListService } from '../shared/name-list/name-list.service';

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

  newName = '';
  errorMessage: string;
  names: any[] = [];

  link: any = {
    url: undefined,
    title: undefined,
    description: undefined,
    ctaHeader: undefined,
    ctaUrl: undefined,
    email: undefined
  };

  constructor(public nameListService: NameListService) {}

  ngOnInit() {
    const urlform: any = document.getElementById('urlform');
    this.applyUrlProtocol(urlform.url);
    this.applyUrlProtocol(urlform.ctaUrl);
  }


  shortUrl() {
      if (this.link.email) {
          this.createLink();
      } else {
          this.login(this.createLink);
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

  private applyUrlProtocol(formElement: HTMLFormElement) {
    const protocol = 'http://';
    formElement.onpaste = function(e) {
        const text = e.clipboardData.getData('text');
        if (/https?:\/\//.test(text)) {
          e.preventDefault();
          formElement.value = text;
        }
    };
    formElement.onfocus = function() {
        if (!formElement.value.trim()) {
            formElement.value = protocol;
        }
    };
    formElement.onblur = function() {
        if (formElement.value.trim() === protocol) {
            formElement.value = '';
        }
    };
  }

  private login(callback: Function) {
      // const options = {
      //     'focusInput': true,
      //     'closable': true,
      //     'callbackURL': '{{AUTH0_CALLBACK_URL}}',
      //     'title': 'jeit.in',
      //     'icon': 'http://jeit.in/wp-content/uploads/2017/11/logo-jeitin.jpg',
      //     'primaryColor': '#80027f',
      //     'responseType': 'token',
      //     'autoclose': true,
      //     'forceJSONP': true,
      //     'popup': false,
      //     'socialBigButtons': false,
      //     'connections': ['facebook', 'twitter']
      // };
      // const lock = new Auth0LockPasswordless('{{AUTH0_CLIENT_ID}}', '{{AUTH0_DOMAIN}}');
      // lock.magiclink(options, function(error: any, email: string) {
      //     if (!error) {
      //         callback(email);
      //     }
      // });
  }


}
