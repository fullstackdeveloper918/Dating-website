import { Component } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  stepper: number = 1;

  resetPassword() {
    // Simulate email send action
    this.stepper++;
  }

  resendEmail() {
    // Logic to resend the email
    console.log('Resending email...');
    alert('A new password reset link has been sent to your email.');
  }

  goBack() {
    // Reset to the initial step
    this.stepper = 1;
  }
}
