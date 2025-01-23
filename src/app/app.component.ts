import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // title = 'Dating-app';
  constructor(private auth: AngularFireAuth, private toastr: ToastrService) {}


  showSuccess() {
    this.toastr.success('Hello world!', 'Success');
  }
 
  ngOnInit(){
    // this.testSignIn();
    this.showSuccess();
  }

  // testSignIn() {
  //   const email = 'thakur.ashok9180@gmail.com'; // Replace with a test email
  //   const password = 'ashok@123'; // Replace with the corresponding password

  //   this.auth.signInWithEmailAndPassword(email, password)
  //     .then((userCredential) => {
  //       console.log('Sign-in successful:', userCredential.user);
  //       alert('Firebase connection successful! User signed in.');
  //     })
  //     .catch((error) => {
  //       console.error('Sign-in error:', error.message);
  //       alert('Firebase connection failed. Check the console for details.');
  //     });
  // }
}
