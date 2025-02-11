import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ViewProfileService } from 'src/app/core/service/view-profile.service';
@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent {
  userId: string | null = null;
  userInfo:any
  constructor(
    private route : ActivatedRoute,
    private viewProfileService: ViewProfileService,
    private toastr: ToastrService,
    private router : Router
  ){
    this.userId = this.route.snapshot.paramMap.get('id');
  }
  ngOnInit(){
    this.getSingleUserInfo();
  }

  // GET SINGLE USER INFO
  getSingleUserInfo(){
    this.viewProfileService.getSingleUserInfo({ user_id: this.userId }).subscribe({
      next: (res: any) => {
        if(res.status == 200){
        this.userInfo = res.data;
        console.log('this.userinfo', this.userInfo)
        }
      },
      error: (err: any) => {
        console.error('Error fetching user info:', err);
        this.toastr.error('Error Fetching user info')
        // Handle error gracefully, e.g., show an error message
      }
    });
}

// SEND PARTICULAT USER MESSAGE
sendParticularUserMessage() {
  const userId = this.userInfo?.people_id;  // Ensure you have the user ID
  if (userId) {
    this.router.navigate(['chat'], { queryParams: { id: userId } });  // Add userId as query param
    console.log('Navigating to chat with userId:', userId);
  } else {
    console.error('User ID not found!');
  }
}

}
