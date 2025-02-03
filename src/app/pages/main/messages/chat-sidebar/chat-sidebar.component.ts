import { Component, EventEmitter, Output } from '@angular/core';
import { ChatService } from 'src/app/core/service/chat.service';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss']
})
export class ChatSidebarComponent {
  searchTerm: string = '';
  selectedChat:any
  chatList : any[] = [
  ];
  onlineUsers:any

  @Output() chatSelected = new EventEmitter<any>();

  constructor( private _chatService : ChatService){
  }

  ngOnInit(){
    this.getUsers();
    this.getOnlineUsers();
  }
  
  selectChat(chat: any) {
    this.chatSelected.emit(chat);
    this.selectedChat = chat; 
  }


  getUsers(){
   this._chatService.getUsers().subscribe((user:any)=>{
    this.chatList = user.data;
    console.log('this.chatlist', this.chatList)
    this.selectedChat = user.data[0]
    this.chatSelected.emit(this.selectedChat);
   })
  }

  filteredChats() {
    return this.chatList.filter(chat => 
      chat.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // GET ONLINE USERS
  getOnlineUsers(){
    this._chatService.getOnlineUsers().subscribe((users:any) => {
      this.onlineUsers = users.users
      console.log('online users', users)
    })
  }
}
