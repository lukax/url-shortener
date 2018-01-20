import {Component, OnInit} from '@angular/core';
import {AuthService, UserProfile} from "../../auth/auth.service";

/**
 * This class represents the toolbar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  profile: UserProfile;

  constructor(public auth: AuthService) {

  }

  ngOnInit(): void {
    this.auth.getProfile().subscribe(x => this.profile = x);
  }

}

