import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { ChatService } from 'src/app/core/service/chat.service';
import { StorageService } from 'src/app/core/service/storage/storage.service';
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
  currentUser: any // user 1
  // selectedChat = { id: 'user2' };
  currentUserName:any

  constructor(
  private chatService: ChatService,
  private storageService : StorageService) {
    const user :any = this.storageService.getItem("user");
    this.currentUser = user.data.people_id
    this.currentUserName = user.data.first_name + " " + user.data.surname
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedChat'] && changes['selectedChat'].currentValue) {
      this.selectedChat = changes['selectedChat'].currentValue;
      console.log('Selected Chat:', this.selectedChat);
      this.messages = []
      // Disconnect & Reconnect socket for the new chat
      this.reconnectSocket();
    }
  }
  
  // RECONNECT SOCKET WHEN SWITCHING USERS
  reconnectSocket() {
    console.log('Reconnecting socket for new chat...');
  
    // Step 1: Disconnect current socket
    this.chatService.disconnect();
     
    // Step 2: Reconnect and register the new user
    setTimeout(() => {
      this.chatService.connect();
      this.chatService.registerUser(this.currentUser);
      this.listenForMessages();
    }, 500); 
  }
  

  ngOnInit(): void {
    this.listenForMessages();
    this.registerUser();
    this.getConnection();
    this.getMessages()
  }

  // LISTEN FOR MESSAGES
  listenForMessages() {
    this.chatService.listenForMessages().subscribe((message) => {
      console.log('New message received:', message);
      this.messages.push(message);
    });
  }

    // REGISTER USER
    registerUser(){
      this.chatService.registerUser(this.currentUser);
    }
  

  // GET CONNECTIION

  getConnection(){     
    this.chatService.getConnectionStatus().subscribe(status => {
      this.connectionStatus = status;
    });
  }


  getMessages(){
    this.chatService.getMessages().subscribe(messages => {
      this.messages = messages;
      console.log('this.messages', this.messages)
      console.log('current User', this.currentUser)
    });
  }
  sendMessage(): void {
    console.log('this.newmeeage', this.newMessage)

    // if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.currentUser,this.selectedChat.people_id,this.newMessage);
      this.messages.push({
        senderId: this.currentUser,
        message : this.newMessage})
      this.newMessage = '';
      console.log('this.messages', this.messages)
    // }
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
