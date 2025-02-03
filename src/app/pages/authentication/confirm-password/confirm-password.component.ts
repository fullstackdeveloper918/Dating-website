import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/service/api/authentication.service';

@Component({
  selector: 'app-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.scss']
})
export class ConfirmPasswordComponent {
  passwordForm: FormGroup;
  email! : string;
  token! : string

  constructor(
  private fb: FormBuilder, 
  private toastr:ToastrService,
  private activatedRoute : ActivatedRoute,
  private _authService : AuthenticationService,
  private router : Router) {
    this.passwordForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required]]
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.email = params['email'];
      this.token = params['token'];
    });
  }

  // confirmPasswordValidator = (control: any) => {
  //   return (this.passwordForm.get('password')?.value === control.value) ? null : { 'notMatch': true };
  // }

  onSubmit() {
    if (this.passwordForm.valid) {
      const passwordControl = this.passwordForm.get('password');
      const confirmPasswordControl = this.passwordForm.get('confirmPassword');  
      if (passwordControl?.value !== confirmPasswordControl?.value) {
        this.toastr.error('Passwords do not match'); 
        return; // Prevent further execution if passwords don't match
      }

      const payload = {
        email : this.email,
        token : this.token,
        password : this.passwordForm.value.password
      }
      this._authService.confirmPassword(payload).subscribe((res:any)=>{
        if(res){
          this.toastr.success(res.message);
          this.router.navigate(['login'])
        }
      })
      // Handle form submission here
    }
  }
}
