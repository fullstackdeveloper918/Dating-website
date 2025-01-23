import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/service/api/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm!: FormGroup; // Declare the login form

  constructor(private fb: FormBuilder, private router: Router, private _authService : AuthenticationService) {}

  ngOnInit(): void {
    this.initializeForm(); // Initialize the form on component initialization
  }

  // Initialize the login form with validation rules
  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email field with required and email format validation
      password: ['', [Validators.required, Validators.minLength(6)]], // Password field with required and minimum length validation
    });
  }

  // Method to handle form submission
  async login(event: Event): Promise<void> {
    event.preventDefault(); // Prevent default form submission behavior
  
    if (this.loginForm.valid) {
      try {
        const response = await this._authService.login(this.loginForm.value).toPromise();
        console.log('Login Successful:', response);
        // Navigate to the home page after successful login or handle response
        // this.router.navigate(['/home']);
      } catch (error) {
        console.error('Login Failed:', error);
        // Display error message to the user if needed
        alert('Login failed. Please check your credentials or try again later.');
      }
    } else {
      this.loginForm.markAllAsTouched(); // Mark all fields as touched to display validation errors
    }
  }
  

  goToHome(event: Event) {
    event.preventDefault();  // Prevent form submission reload
    console.log('This is working');
    this.router.navigate(['/main']);
  }

}
