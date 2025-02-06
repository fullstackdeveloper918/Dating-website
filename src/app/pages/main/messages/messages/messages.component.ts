import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent {
  currentChat: any;
  newMessage: any = null;

  onChatSelected(chat: any) {
    this.currentChat = chat;
  }

  handleNewMessage(message: any) {
    // console.log('New message received in parent:', message);
    // this.newMessage = message
  }


}
