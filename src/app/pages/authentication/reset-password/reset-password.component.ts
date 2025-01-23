import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/service/api/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetForm!: FormGroup  
  email!: string
  token!: string
  constructor(
  private fb: FormBuilder, 
  private _authService : AuthenticationService,
  private router: Router,
  private toastr : ToastrService,
  private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]] 
    });
  }

  resetPassword() {
    // Simulate email send action
    console.log('emal',this.resetForm?.value)
    if(this.resetForm.valid){
     this._authService.resetPassword(this.resetForm.value).subscribe((res:any)=>{
      if(res.status == 200){
       this.toastr.success('Email send succesfully');
      }
     })
    }
  }

  resendEmail() {
    // Logic to resend the email
    console.log('Resending email...');
    alert('A new password reset link has been sent to your email.');
  }

  // goBack() {
  //   // Reset to the initial step
  //   this.stepper = 1;
  // }
}
