import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent {
  @Input() selectedChat: any;

  messages = [
    { sender: 'me', text: 'Hello!' },
    { sender: 'John Doe', text: 'Hey, how are you?' },
    { sender: 'me', text: 'I’m good, thanks! What about you?' },
  ];

  newMessage = '';

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ sender: 'me', text: this.newMessage.trim() });
      this.newMessage = '';
    }
  }
}
