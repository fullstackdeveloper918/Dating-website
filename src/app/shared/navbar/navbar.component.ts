import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/core/service/chat.service';
import { StorageService } from 'src/app/core/service/storage/storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(
  private router: Router,
  private storageService: StorageService,
  private chatService: ChatService
  ){}

  logOut(){
  this.chatService.disconnect();
  this.storageService.removeItem('user');
  this.router.navigate(['/login'])
  }
}
