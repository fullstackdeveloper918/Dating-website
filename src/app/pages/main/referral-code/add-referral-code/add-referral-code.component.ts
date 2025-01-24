import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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
    private refferalCodeService : ReferralCodeService
  ) {
    // Initialize form with validation
    this.referralCodeForm = this.fb.group({
      referralCode: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(10),
        ],
      ],
    });
  }

  // Handle form submission
  async onSubmit(): Promise<void> {
    if (this.referralCodeForm.valid) {
      const payload = {
        referral_code: this.referralCodeForm.value.referralCode
      };
    
      try {
        const response = await this.refferalCodeService.addReferralCode(payload).toPromise();
        console.log('Response:', response);
        if(response.status == 200){
          this.dialogRef.close('success')
        }
      } catch (error) {
        console.error('Error adding referral code:', error);
      }
    }
  }
  // Handle dialog cancel action
  onCancel(): void {
    this.dialogRef.close();
  }
}
