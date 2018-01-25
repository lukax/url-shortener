import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateLinkComponent } from './components/link-create/link-create.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: CreateLinkComponent }
    ])
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
