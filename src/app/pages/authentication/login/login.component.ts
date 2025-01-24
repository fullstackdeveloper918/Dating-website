import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/service/api/authentication.service';
import { StorageService } from 'src/app/core/service/storage/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm!: FormGroup; // Declare the login form

  constructor(
  private fb: FormBuilder, 
  private router: Router, 
  private _authService : AuthenticationService,
  private _storageService : StorageService,
  private tostr : ToastrService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]], 
    });
  }

  // LOGIN
  async login(event: Event): Promise<void> {
    event.preventDefault(); 
    if (this.loginForm.valid) {
      try {
        const response = await this._authService.login(this.loginForm.value).toPromise();
        if(response.status == 200){
          this.tostr.success('Login Successfully')
          this._storageService.setItem('user',response)
          this.router.navigate(['/main']);
        }
      } catch (error:any) {
        this.tostr.error(error)
      }
    } else {
      this.tostr.error('Form is invalid. Please fill out all required fields.')
      this.loginForm.markAllAsTouched(); 
    }
  }
  
  // GO TO HOME
  goToHome(event: Event) {
    event.preventDefault();  // Prevent form submission reload
    console.log('This is working');
    this.router.navigate(['/main']);
  }

}
