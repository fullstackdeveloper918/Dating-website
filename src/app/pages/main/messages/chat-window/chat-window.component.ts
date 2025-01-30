import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { ChatService } from 'src/app/core/service/chat.service';
import { apiUrl } from 'src/environment';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent {
  @Input() selectedChat: any;   // user 2
  connectionStatus: string = 'Disconnected';
  messages: any[] = [];
  newMessage: string = '';
  currentUser = { id: 'senderId' };  // user 1
  // selectedChat = { id: 'user2' };

  constructor(private chatService: ChatService) {}

  ngOnChanges(changes: SimpleChanges){
    // console.log("changes", changes['selectedChat']?.currentValue);
    this.selectedChat = changes['selectedChat']?.currentValue
  }

  ngOnInit(): void {
    this.chatService.getConnectionStatus().subscribe(status => {
      this.connectionStatus = status;
    });

    this.chatService.getMessages().subscribe(messages => {
      this.messages = messages;
    });
    
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.newMessage);
      console.log('this.messages',this.messages)
      this.newMessage = '';
    }
    // this.getMessage();
  }

  // getMessage(){
  //   this.chatService.listenForMessages().subscribe((message)=>{
  //     console.log('message',message)
  //   })
  // }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
}
