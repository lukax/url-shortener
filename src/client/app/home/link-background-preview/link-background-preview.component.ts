import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthService, UserProfile} from "../../auth/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {CreateLinkDto} from "../../shared/entities";
import {AuthHttp} from "angular2-jwt";
import {Headers, Http} from '@angular/http';

@Component({
  moduleId: module.id,
  selector: 'sd-link-background-preview',
  templateUrl: 'link-background-preview.component.html',
  styleUrls: ['link-background-preview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkBackgroundPreviewComponent {

  constructor() {

  }

}
