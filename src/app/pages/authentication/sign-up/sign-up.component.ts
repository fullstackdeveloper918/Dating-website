import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  constructor(private router: Router){}

  resetPassword(event: MouseEvent): void {
    event.preventDefault(); // Prevents the default behavior of the anchor tag (navigation)
    // Your logic for resetting the password here
    console.log('Reset password clicked');
  }
}
