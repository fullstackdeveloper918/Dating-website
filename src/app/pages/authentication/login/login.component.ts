import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private router: Router){}

  goToHome(event: Event) {
    event.preventDefault();  // Prevent form submission reload
    console.log('This is working');
    this.router.navigate(['/home']);
  }

}
