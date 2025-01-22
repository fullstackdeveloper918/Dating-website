import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss']
})
export class ChatSidebarComponent {
  chatList = [
    { name: 'John Doe', avatar: 'https://via.placeholder.com/150', lastMessage: 'Hey there!' },
    { name: 'Jane Smith', avatar: 'https://via.placeholder.com/150', lastMessage: 'What’s up?' },
    { name: 'Alice Johnson', avatar: 'https://via.placeholder.com/150', lastMessage: 'Let’s meet tomorrow.' },
  ];

  @Output() chatSelected = new EventEmitter<any>();

  selectChat(chat: any) {
    this.chatSelected.emit(chat);
  }
}
