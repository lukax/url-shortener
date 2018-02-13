import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthService, UserProfile} from "../../auth/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {CreateLinkViewModel} from "../../shared/entities";
import {Headers, Http} from '@angular/http';

@Component({
  moduleId: module.id,
  selector: 'sd-link-preview-background',
  templateUrl: 'link-preview-background.component.html',
  styleUrls: ['link-preview-background.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkPreviewBackgroundComponent {

  constructor() {

  }

}
