import { Component, EventEmitter, Output } from '@angular/core';
import { ChatService } from 'src/app/core/service/chat.service';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss']
})
export class ChatSidebarComponent {
  searchTerm: string = '';

  chatList : any[] = [
  ];

  @Output() chatSelected = new EventEmitter<any>();

  constructor( private _chatService : ChatService){
  }

  ngOnInit(){
    this.getUsers();
  }
  
  selectChat(chat: any) {
    this.chatSelected.emit(chat);
  }


  getUsers(){
   this._chatService.getUsers().subscribe((user:any)=>{
    this.chatList = user.data;
    console.log('this.chatlist', this.chatList)
   })
  }

  filteredChats() {
    return this.chatList.filter(chat => 
      chat.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
