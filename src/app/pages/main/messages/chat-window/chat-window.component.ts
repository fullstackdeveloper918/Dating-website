import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { timestamp } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { ChatService } from 'src/app/core/service/chat.service';
import { StorageService } from 'src/app/core/service/storage/storage.service';
import { apiUrl } from 'src/environment';
import { format, isToday, isYesterday } from 'date-fns';


@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('messageList') messageList!: ElementRef;
  @Input() selectedChat: any;   // user 2
  @Output() newMessages = new EventEmitter<any>();
  connectionStatus: string = 'Disconnected';
  messages: any[] = [];
  newMessage: string = '';
  currentUser: any // user 1
  // selectedChat = { id: 'user2' };
  currentUserName:any
  isUserOnline!:boolean
  showScrollButton = false;
  constructor(
  private chatService: ChatService,
  private storageService : StorageService,
  private router : Router) {
    const user :any = this.storageService.getItem("user");
    this.currentUser = user.data.people_id
    this.currentUserName = user.data.username
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedChat'] && changes['selectedChat'].currentValue) {
      this.selectedChat = changes['selectedChat'].currentValue;
      this.messages = [];
      // Disconnect & Reconnect socket for the new chat
      this.reconnectSocket();
      this.readMessages();
      this.seenMessage();
      this.emitCheckMessages();
      this.setCounterZero();
      // this.checkMessageEvent();
      // this.emitCheckMessages();
      // this.getOnlineStatus();
      setTimeout(() => this.scrollToBottom(), 100);

    }
  }
  

  ngOnInit(): void {
   setTimeout(() => {
    this.messageHistory();
   }, 3000); 
    this.registerUser();
    this.listenForMessages();
    this.getConnection();
    this.getMessages();
    this.getOnlineUsers();
    this.getUnseenMessages();
    this.receiveMessage();

    // this.getOfflineMessages();
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  // ngOnChanges() {
  // }

  checkScroll() {
    const container = this.messageList.nativeElement;
    this.showScrollButton = container.scrollHeight - container.scrollTop > container.clientHeight + 100;
  }

  scrollToBottom() {
    setTimeout(() => {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      this.showScrollButton = false;
    }, 100);
  }

  

  // Call this method when clicking on a chat
  onChatClick() {
    this.scrollToBottom();
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
        this.messageHistory();
      }, 500); 
    }

    // RECEIVE MESSAGES
    receiveMessage(){
      this.chatService.receiveMessages().subscribe((res:any)=>{
        // this.messages.push(res)
        if(res.sender_id == this.selectedChat.people_id){
          this.messages.push(res)
        }
        this.newMessages.emit(res);
        console.log('this.message', this.messages)
        console.log('recievemessage', res)
      })
    }
    


  // GET USER HISTORY MESSAGES
  messageHistory() {    
    const payload = {
      sender_id: this.currentUser,
      receiver_id: this.selectedChat?.people_id
    };
  
    this.chatService.getMessageHistory(payload).subscribe((res: any) => {
      if (res.status == 200) {  
        // Combine sender and receiver messages
        const combinedMessages = [
          ...res.data.receiver_messages, 
          ...res.data.sender_messages
        ];
  
        // Sort messages by timestamp
        this.messages = combinedMessages.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
  
        // Process messages to add date headers
        this.groupMessagesByDate();
  
        console.log('this.messages', this.messages);
      }
    });
  }
  
  groupMessagesByDate() {
    let lastDate: string | null = null;
    
    this.messages = this.messages.map((message) => {
      const messageDate = new Date(message.timestamp);
      let formattedDate: string;
  
      if (isToday(messageDate)) {
        formattedDate = 'Today';
      } else if (isYesterday(messageDate)) {
        formattedDate = 'Yesterday';
      } else {
        formattedDate = format(messageDate, 'dd-MM-yyyy'); // Exact date for older messages
      }
  
      if (formattedDate !== lastDate) {
        lastDate = formattedDate;
        return { ...message, dateHeader: formattedDate };
      } else {
        return { ...message, dateHeader: null };
      }
    });
  }
  
  // LISTEN FOR MESSAGES
  listenForMessages() {
    this.chatService.listenForMessages().subscribe((message) => {
      // this.messages.push(message);
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
    });
  }
  sendMessage(): void {

    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.currentUser,this.selectedChat.people_id,this.newMessage);
      this.messages.push({
        sender_id: this.currentUser,
        message : this.newMessage,
        receiver_id : this.selectedChat.people_id,
        timestamp : Date.now()
      })
      // this.messageHistory();  
      this.newMessage = '';
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
      // this.getMessages();
    }
  }

  // getMessages() {
  //   this.chatService.getMessages().subscribe((messages: any[]) => {

  //     this.messages.push(messages)
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

    // GET ONLINE STATUS
    getOnlineUsers(){
      this.chatService.getOnlineUsers().subscribe((users:any) => {
        // this.onlineUsers.push(users);
        if(users.users.includes(this.selectedChat?.people_id)){
          this.isUserOnline = true;
        } else {
          this.isUserOnline = false;
        }
      });
      
      this.chatService.getOfflineUsers().subscribe((user) => {
        if(user === this.selectedChat?.people_id){
          this.isUserOnline = false;
        }
      }); 
    }

    // FILE UPLOAD FEATURE

    handleFileUpload(event: any) {
      const file = event.target.files[0];
      if (file) {
    
        // You can now send the file to your backend via WebSockets or API
        this.uploadFile(file);
      }
    }
    
    uploadFile(file: File) {
      const formData = new FormData();
      formData.append('file', file);
    
      // Example: Sending file through WebSocket
      // this.chatService.sendFileMessage(formData);
    }

    sendFileMessage(fileData: FormData) {
      // if (this.socket.connected) {
      //   this.socket.emit('send_file', fileData);
      // } else {
      //   console.warn('WebSocket is not connected.');
      // }
    }

    // check user online
    // checkUserOnline(){
    // if(this.onlineUsers.includes(this.selectedChat.people_id)){
    //   return "Online"
    // } else{
    //   return "Offline";
    // }
    // // console.log('this.selectChat', this.selectedChat)
    // }

    // READ MESSAGES WHEN CHAT
    readMessages(){
      console.log(this.messages)
        // this.chatService.messageSeen()
    }
    messageId:any

    getUnseenMessages(){
      this.chatService.getUnseenMessages().subscribe((res:any)=>{
        this.messageId = res;
        console.log('messageId',res)
      })
    }

    seenMessage(){
     this.chatService.seenMessage(this.messageId)
    }

    // EMIT CHECK MESSAGE EVENT
    emitCheckMessages(){
      this.chatService.emitCheckMessageEvent(this.selectedChat)
    }

    // // CHECK MESSAGE EVENT
    // checkMessageEvent(){
    //   this.chatService.emit
    // }

    // SET COUNTER ZERO FOR MESSAGES
    setCounterZero(){
      
    }
 
}
