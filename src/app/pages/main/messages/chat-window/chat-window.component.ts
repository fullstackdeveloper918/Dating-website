import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
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
  private storageService : StorageService,
  private router : Router) {
    const user :any = this.storageService.getItem("user");
    this.currentUser = user.data.people_id
    this.currentUserName = user.data.first_name + " " + user.data.surname
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedChat'] && changes['selectedChat'].currentValue) {
      this.selectedChat = changes['selectedChat'].currentValue;
      console.log('Selected Chat:', this.selectedChat);
      this.messages = [];
      // Disconnect & Reconnect socket for the new chat
      this.reconnectSocket();
      this.messageHistory();
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
   setTimeout(() => {
    this.messageHistory();
   }, 3000); 
    this.listenForMessages();
    this.registerUser();
    this.getConnection();
    this.getMessages()
  }


  // GET USER HISTORY MESSAGES
  messageHistory() {
    console.log("this.selectedChat", this.selectedChat);
    
    const payload = {
      sender_id: this.currentUser,
      receiver_id: this.selectedChat.people_id
    };
  
    this.chatService.getMessageHistory(payload).subscribe((res: any) => {
      if (res.status == 200) {
        console.log('res', res.data);
  
        // Combine sender and receiver messages
        const combinedMessages = [
          ...res.data.receiver_messages, 
          ...res.data.sender_messages
        ];
  
        // Sort messages by timestamp
        this.messages = combinedMessages.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
  
        console.log('Sorted messages:', this.messages);
      }
    });
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
      this.messageHistory();
      // this.messages = messages;
      console.log('this.messages', this.messages)
      console.log('current User', this.currentUser)
    });
  }
  sendMessage(): void {
    console.log('this.newmeeage', this.newMessage)

    // if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.currentUser,this.selectedChat.people_id,this.newMessage);
      // this.messages.push({
      //   senderId: this.currentUser,
      //   message : this.newMessage})
      this.newMessage = '';
      // this.getMessages();
      console.log('this.messages', this.messages)
    // }
    this.messageHistory();
  }

  // getMessages() {
  //   this.chatService.getMessages().subscribe((messages: any[]) => {
  //     // console.log('messages',messages)
  //     // console.log('this.message', this.messages)
  //     this.messages.push(messages)
  //     console.log('this.messages', this.messages)
  //     // this.messages.push(...messages); // Spread operator to add multiple messages
  //   });
  // }

  

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
  
  logout(){
    this.storageService.removeItem('user');
    this.router.navigate(['/login'])
    }
 
}
