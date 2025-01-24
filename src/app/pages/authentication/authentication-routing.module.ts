import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ConfirmPasswordComponent } from './confirm-password/confirm-password.component';

const routes: Routes = [
  {
    path : '',
    redirectTo : 'sign-up',
    pathMatch : 'full'
  },
  {
    path : 'sign-up',
    component : SignUpComponent
  },
  {
    path : 'login',
    component : LoginComponent
  },
  {
    path : 'reset-password',
    component : ResetPasswordComponent
  },
  {
    path : 'verify-email/:email',
    component : VerifyEmailComponent
  },
  { 
    path: 'confirm-password',
    component: ConfirmPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
