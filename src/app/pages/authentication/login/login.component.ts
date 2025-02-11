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
  private tostr : ToastrService,
  private storageService : StorageService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkUser();
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      sec_email: ['', [Validators.required, Validators.email]], 
      sec_password: ['', [Validators.required, Validators.minLength(6)]], 
    });
  }

  // CHECK USER
  checkUser(){
   const user = this.storageService.getItem("user")
   if(user){
    this.router.navigate(['/chat'])
   }
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
        if(error.status == 400){
          this.tostr.error('Email or Password Incorrect')
        }
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
