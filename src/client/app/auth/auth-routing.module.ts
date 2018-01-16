import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CallbackComponent } from './callback.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'callback', component: CallbackComponent }
    ])
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
