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

  constructor(private fb: FormBuilder, private _authService : AuthenticationService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.signUpForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  register() {
    console.log('working');
    
    if (this.signUpForm.valid) {
      this._authService.register(this.signUpForm.value).subscribe((res:any)=>{
        console.log('res',res)
      })
      // console.log('Form Submitted:', this.signUpForm.value);
      // Handle the registration logic here
    } else {
      this.signUpForm.markAllAsTouched();
    }
  }

  resetPassword(event: Event): void {
    event.preventDefault();
    console.log('Reset password clicked');
    // Implement reset password logic
  }
}
