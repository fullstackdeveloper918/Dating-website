import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/service/api.service';
import { AuthenticationService } from 'src/app/core/service/api/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent {
  verifyForm!: FormGroup;
  timeLeft: number = 300; // 3 minutes in seconds
  timer: any;
  isTimeUp: boolean = false;
  email:any

  constructor(
    private fb: FormBuilder, 
    private _authService : AuthenticationService,
    private toastr: ToastrService,
    private router : Router,
    private route: ActivatedRoute) {
      this.email = this.route.snapshot.paramMap.get('email');
    }

  ngOnInit(): void {
    this.initializeForm();
    this.startTimer();
  }

  initializeForm(): void {
    this.verifyForm = this.fb.group({
      digit1: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit2: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit3: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit4: ['', [Validators.required, Validators.pattern('[0-9]')]],
    });
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.timer);
        this.isTimeUp = true; 
      }
    }, 1000); // Decrement every second
  }

  verifyCode(): void {
    if (this.verifyForm.valid && !this.isTimeUp) {
      const codeString = Object.values(this.verifyForm.value).join(''); // Concatenate digits into a string
      const payload = {
        code : parseInt(codeString, 10)
      }
      this._authService.verifyEmail(payload)
      .subscribe((res:any)=>{
        if(res.status == 200){
          this.toastr.success(res.message);
          this.router.navigate(['/login'])
        }
      })
      console.log('Entered Code:', payload);
      // Call API to verify the code
    } else {
      this.verifyForm.markAllAsTouched();
      if (this.isTimeUp) {
        console.error('Time is up! Please request a new code.');
      }
    }
  }

  resendCode(): void {
    this.verifyForm.reset();
    try {
      this.resetTimer();
      
      const payload = {
        email: this.email
      };
  
      this._authService.resendCode(payload).subscribe({
        next: (res: any) => {
          if(res.status == 200){
            this.toastr.success(res.message)
          }
          console.log('res', res);
        },
        error: (err) => {
          console.error('Error occurred while resending the code:', err);
          this.toastr.error('Error', err)
        }
      });
  
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      // Handle any unexpected errors
    }
  }

  // FORMAT TIMIING FOR TIMER
  formatTime(timeInSeconds: number): string {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  // Helper function to pad numbers to ensure two digits
  pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  resetTimer(): void {
    clearInterval(this.timer);
    this.timeLeft = 300; // Reset to 3 minutes
    this.isTimeUp = false;
    this.startTimer(); // Restart timer
  }

  // Clean up interval when component is destroyed
  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
