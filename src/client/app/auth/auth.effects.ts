import {Actions, Effect} from "@ngrx/effects";
import {State} from "../home/link-create/link-create.reducer";
import {Action, Store} from "@ngrx/store";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Auth} from "./auth.actions";
import {AuthService} from "./auth.service";

@Injectable()
export class AuthEffects {

  @Effect() login$: Observable<Auth.Actions> = this.actions$
    .ofType(Auth.ActionTypes.LOGIN)
    .map((action: Auth.LoginAction) => {
      if(!this.authService.isAuthenticated()) {
        this.authService.login();
      }
      return new Auth.LoginDoneAction();
    });

  @Effect() handleAuthentication$: Observable<Auth.Actions> = this.actions$
    .ofType(Auth.ActionTypes.HANDLE_AUTHENTICATION)
    .map((action: Auth.HandleAuthenticationAction) => {
      this.authService.handleAuthentication();
      return new Auth.HandleAuthenticationDoneAction();
    });

  constructor(
    private store: Store<State>,
    private actions$: Actions,
    private authService: AuthService
  ) { }
}
