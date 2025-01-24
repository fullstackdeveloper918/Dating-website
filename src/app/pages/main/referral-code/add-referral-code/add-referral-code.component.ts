import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ReferralCodeService } from 'src/app/core/service/referral-code.service';

@Component({
  selector: 'app-add-referral-code',
  templateUrl: './add-referral-code.component.html',
  styleUrls: ['./add-referral-code.component.scss']
})
export class AddReferralCodeComponent {
  referralCodeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddReferralCodeComponent>,
    private refferalCodeService : ReferralCodeService,
    private toastr : ToastrService
  ) {
    // Initialize form with validation
    this.referralCodeForm = this.fb.group({
      referralCode: [
        '',
        [
          Validators.required,
          Validators.minLength(6), Validators.maxLength(6)
        ],
      ],
    });
  }

  // Handle form submission
  async onSubmit(): Promise<void> {
    if (this.referralCodeForm.invalid) {
      if (this.referralCodeForm.get('referralCode')?.hasError('required')) {
        this.toastr.error('Referral code is required.', 'Validation Error');
      } else {
        this.toastr.error('Referral code must be exactly 6 characters long.', 'Validation Error');
      }
      return;
    }
  
    const payload = {
      referral_code: this.referralCodeForm.value.referralCode
    };
  
    try {
      const response = await this.refferalCodeService.addReferralCode(payload).toPromise();
      console.log('Response:', response);
      if (response.status === 200) {
        this.dialogRef.close('success');
      }
    } catch (error:any) {
      if(error.status == 400){
        this.toastr.error("Referral code already used.")
      }
      // this.toastr.error(error?.error?.message || 'Failed to add referral code.', 'Error');
      console.error('Error adding referral code:', error);
    }
  }
  
  // Handle dialog cancel action
  onCancel(): void {
    this.dialogRef.close();
  }
}
