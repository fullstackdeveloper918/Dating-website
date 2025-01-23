import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/service/api/authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  signUpForm!: FormGroup;

  constructor(private fb: FormBuilder, private _authService : AuthenticationService, private router: Router) {}

  ngOnInit(): void {
    this.initializeForm();
  }
 
  // INITIALISE FORM
  initializeForm(): void {
    this.signUpForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      referralCode: ['']
    });
  }

  // SIGN UP
  register() {
    console.log('working', this.signUpForm.get('userName')?.valid);
    if (this.signUpForm.valid) {
      try {
        this._authService.register(this.signUpForm.value).subscribe({
          next: (res: any) => {
            if(res.status == '200'){
              this.router.navigate(['verify-email'])
            }
            console.log('Registration successful:', res);
            // Additional logic for success, e.g., navigate to login page or show success message
          },
          error: (err: any) => {
            console.error('Error during registration:', err);
            // Show error message to the user
            alert('Registration failed. Please try again later.');
          }
        });
      } catch (error) {
        console.error('Unexpected error:', error);
        alert('Something went wrong. Please try again.');
      }
    } else {
      this.signUpForm.markAllAsTouched();
      console.log('Form is invalid. Please fill out all required fields.');
    }
  }
  

  resetPassword(event: Event): void {
    event.preventDefault();
    console.log('Reset password clicked');
    // Implement reset password logic
  }
}
