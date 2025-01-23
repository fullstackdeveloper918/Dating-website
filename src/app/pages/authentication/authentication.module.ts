import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ConfirmPasswordComponent } from './confirm-password/confirm-password.component';

const module = SharedModule
@NgModule({ 
  declarations: [
    SignUpComponent,
    LoginComponent,
    ResetPasswordComponent,
    VerifyEmailComponent,
    ConfirmPasswordComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
      // SharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AuthenticationModule { }
