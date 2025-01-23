import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.scss']
})
export class ConfirmPasswordComponent {
  passwordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required, this.confirmPasswordValidator.bind(this)]]
    });
  }

  confirmPasswordValidator(control: any) {
    return (this.passwordForm.get('password')?.value === control.value) ? null : { 'notMatch': true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      // Handle form submission here
      console.log(this.passwordForm.value); 
    }
  }
}
