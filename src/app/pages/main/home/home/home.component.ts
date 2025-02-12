import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApiService } from '../../../../core/service/api.service';
import { HomeService } from 'src/app/core/service/home.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/core/service/chat.service';
import { StorageService } from 'src/app/core/service/storage/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  userList!: any[]
  avatarUrl: string = "https://media.istockphoto.com/id/500954812/vector/male-avatar-profile-picture-vector-illustations.jpg?s=612x612&w=is&k=20&c=E5qY1LN6KkouiRaiqRyL5GyvwUOvNRaAnJGna2FtVDo="
  currentUser: any
  constructor(
  private homeService : HomeService,
  private toastr : ToastrService,
  private router : Router,
  private chatService: ChatService,
  private storageService : StorageService){
    const user :any = this.storageService.getItem("user");
    this.currentUser = user.data.people_id
  }

  ngOnInit(){
    this.getUsers()
    this.connectSocket();
    this.registerUser();
  }

  async getUsers(): Promise<void> {
    try {
      const response = await this.homeService.getUsers().toPromise();
      if (response.status == 200) {
        this.userList = response.data;
      } 
    } catch (error) {
      // this.toastr.error('Error fetching users');
    }
  }

  // GO TO USER PROFILE
  goToUserProfile(user:any){
    this.router.navigate([`main/profile/view-profile/${user.people_id}`])
  }

  // SEND PARTICULAT USER MESSAGE
sendParticularUserMessage(user:any) {
  const userId = user?.people_id;  // Ensure you have the user ID
  if (userId) {
    this.router.navigate(['chat'], { queryParams: { id: userId } });  // Add userId as query param
  } else {
    this.toastr.error("User Id not found")
    console.error('User ID not found!');
  }
}

// CONNECT SOCKET
connectSocket(){
  this.chatService.connect();
}

// REGISTER USER
registerUser(){
  this.chatService.registerUser(this.currentUser);
}
}
  