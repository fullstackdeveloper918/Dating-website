import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/service/api/authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  signUpForm!: FormGroup;

  constructor(
  private fb: FormBuilder,
  private _authService : AuthenticationService, 
  private router: Router,
  private toastr : ToastrService) {}

  ngOnInit(): void {
    this.initializeForm();
  }
 
  // INITIALISE FORM and Vercel error resolve
  initializeForm(): void {
    this.signUpForm = this.fb.group({
      first_name : ['', Validators.required],
      surname : ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(3)]],
      sec_email: ['', [Validators.required, Validators.email]],
      sec_password: ['', [Validators.required, Validators.minLength(6)]],
      // referralCode: ['', Validators.minLength(6)]
    });
  }

  // SIGN UP
  register() {
    console.log('working', this.signUpForm.get('userName')?.valid);
    if (this.signUpForm.valid) {
      try {
        this._authService.register(this.signUpForm.value).subscribe(
          (res: any) => {
            if(res.status == '200'){
              this.toastr.success('Register user successfully , Enter 4 digit code')
              this.router.navigate([`verify-email/${this.signUpForm.value.sec_email}`]);
               }
          },
          // error: (err: any) => {
          //   this.toastr.error('Error during registration')
          // }
        );
      } catch (error) {
        this.toastr.error('Error during registration')
      }
    } else {
      this.signUpForm.markAllAsTouched();
      this.toastr.error('Form is invalid. Please fill out all required fields.')
    }
  }

  // CHECK REFERRAL CODE
  onReferralCodeChange(event: any): void {
    const referralCode = event.target.value;
    console.log(referralCode.length);
      
    // Check if the referral code length is 6
    if (referralCode && referralCode.length === 6) {
      console.log('event', referralCode);
      const payload = {
        referralCode: referralCode,
      };
  
      // Call API only if the referral code length is 6
      this.checkReferralCode(payload);
    }
  }
  
  async checkReferralCode(payload: { referralCode: string }) {
    try {
      // Make the API call
      const response = await this._authService.checkReferralCode(payload).toPromise();
      console.log('API response', response);
      // Handle the API response here
    } catch (error:any) {
      this.toastr.error(error.error.message)
      console.error('API error', error);
      // Handle error (optional)
    }
  }
  
  

  resetPassword(event: Event): void {
    event.preventDefault();
    console.log('Reset password clicked');
    // Implement reset password logic
  }
}
