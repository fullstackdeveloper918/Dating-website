import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApiService } from '../../../../core/service/api.service';
import { HomeService } from 'src/app/core/service/home.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  userList!: any[]
  avatarUrl: string = "https://media.istockphoto.com/id/500954812/vector/male-avatar-profile-picture-vector-illustations.jpg?s=612x612&w=is&k=20&c=E5qY1LN6KkouiRaiqRyL5GyvwUOvNRaAnJGna2FtVDo="
  constructor(
  private homeService : HomeService,
  private toastr : ToastrService){}

  ngOnInit(){
    this.getUsers()
  }

  async getUsers(): Promise<void> {
    try {
      const response = await this.homeService.getUsers().toPromise();
      if (response.status == 200) {
        console.log('response',response.data[0])
        this.userList = response.data;
      } 
    } catch (error) {
      this.toastr.error('Error fetching users');
    }
  }
}
