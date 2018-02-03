import { Component } from '@angular/core';
import { Config } from './shared/config/env.config';
import './operators';
import {AuthService} from "./auth/auth.service";
import {ActionsSubject} from "@ngrx/store";
import {Auth} from "./auth/auth.actions";

/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {


  constructor(private actionsSubject: ActionsSubject) {
    console.log('Environment config', Config);

    this.actionsSubject.next(new Auth.HandleAuthenticationAction());
  }


}
