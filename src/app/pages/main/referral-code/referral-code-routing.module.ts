import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferralCodeComponent } from './referral-code/referral-code.component';

const routes: Routes = [
  {
    path : '',
    component : ReferralCodeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferralCodeRoutingModule { }
