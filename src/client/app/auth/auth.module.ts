import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallbackComponent } from './callback.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './auth.service';

@NgModule({
  imports: [CommonModule, AuthRoutingModule],
  declarations: [CallbackComponent],
  providers: [AuthService],
  exports: [CallbackComponent]
})
export class AuthModule { }
