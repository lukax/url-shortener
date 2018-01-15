import {Component, OnInit} from '@angular/core';
import {AuthService, UserProfile} from "../../auth/auth.service";

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  profile: UserProfile;

  constructor(public auth: AuthService){

  }

  ngOnInit(): void {
    this.auth.getProfile().subscribe(x => this.profile = x);

  }

}
