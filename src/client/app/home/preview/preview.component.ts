import { Component, OnInit } from '@angular/core';
import {AuthService, UserProfile} from "../../auth/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {LinkCreateDto} from "../../core/LinkDto";
import {AuthHttp} from "angular2-jwt";
import {Headers, Http} from '@angular/http';

@Component({
  moduleId: module.id,
  selector: 'sd-preview',
  templateUrl: 'preview.component.html',
  styleUrls: ['preview.component.css'],
})
export class PreviewComponent {

  constructor() {

  }

}
