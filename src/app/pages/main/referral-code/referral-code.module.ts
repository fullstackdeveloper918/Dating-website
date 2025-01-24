import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReferralCodeRoutingModule } from './referral-code-routing.module';
import { ReferralCodeComponent } from './referral-code/referral-code.component';
import { AddReferralCodeComponent } from './add-referral-code/add-referral-code.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    ReferralCodeComponent,
    AddReferralCodeComponent
  ],
  imports: [
    CommonModule,
    ReferralCodeRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    // BrowserAnimationsModule
  ]
})
export class ReferralCodeModule { }
