import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/service/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  userForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  currentProfilePicUrl: string | null = 'https://media.istockphoto.com/id/500954812/vector/male-avatar-profile-picture-vector-illustations.jpg?s=612x612&w=is&k=20&c=E5qY1LN6KkouiRaiqRyL5GyvwUOvNRaAnJGna2FtVDo='; // Variable to store the current profile picture URL

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastr : ToastrService
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      profilePicture: [''] // Placeholder for the profile picture field
    });
  }

  ngOnInit(): void {
    // Call method to fetch user info, including current profile picture URL
    this.getUserInfo();
  }


  // Fetch current user information, including the profile picture URL
  getUserInfo(): void {
    this.userService.getUserInfo().subscribe((userData: any) => {
      this.userForm.patchValue({
        username: userData.data.username,
        // email: userData.data.email
      });
      
      // Set current profile picture URL
      this.currentProfilePicUrl = userData.data.profile_image || 'https://media.istockphoto.com/id/500954812/vector/male-avatar-profile-picture-vector-illustations.jpg?s=612x612&w=is&k=20&c=E5qY1LN6KkouiRaiqRyL5GyvwUOvNRaAnJGna2FtVDo='; // Update with correct response field
    }); 
  }

  // Handle file selection
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Form submission
  onSubmit(): void {
    // if (this.userForm.valid) {
      const formData = new FormData();
      formData.append('userName', this.userForm.get('username')?.value);
      formData.append('password', this.userForm.get('password')?.value);
      
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }
      
      // Call your service to update user information along with profile picture
      this.userService.updateUserInfo(formData)
      .subscribe(
        (response) => {
          if(response.status == 200){
           this.toastr.success('User profile update successfully');
           this.previewUrl = null
           this.selectedFile = null
           this.userForm.patchValue({ profilePicture: '' });
           this.getUserInfo();
          }
          // this.router.navigate(['/profile']); // Redirect after successful update
        },
        (error) => {
          console.error('Error updating user information', error);
        }
      );
    // }
  }
}
