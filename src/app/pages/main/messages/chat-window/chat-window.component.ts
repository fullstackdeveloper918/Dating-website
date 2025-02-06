import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, Subject, timestamp } from 'rxjs';
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
  @ViewChild('scroll', { static: false }) scroll!: ElementRef;
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
  lastSeen : any;
  isUserTyping: boolean = false;
  showArchived = false;
archivedMessages: any[] = [];
  private typingSubject = new Subject<void>();
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
      this.newMessage = '';
      this.reconnectSocket();
      this.readMessages();
      this.seenMessage();
      this.emitCheckMessages();
      this.setCounterZero();
      this.getLastSeen();
  
      // Ensure messages load first before scrolling
      setTimeout(() => this.scrollToBottom(), 300);
    }
  }
  
  

  ngOnInit(): void {
   setTimeout(() => {
    this.messageHistory();
   }, 3000); 
    this.registerUser();
    // this.listenForMessages();
    this.getConnection();
    this.getMessages();
    this.getOnlineUsers();
    this.getOfflineUsers();
    // this.getUnseenMessages();
    this.receiveMessage();
    this.getDeleteMessages()
    this.getSenderMessage();
    this.getFavoriteMessage();
    // this.getOfflineMessages();
    this.getUserTyping();
    this.getUserStoppedTyping();
    this.typingSubject.pipe(debounceTime(2000)).subscribe(() => {
      this.emitUserStoppedTyping();
    });
  }


  // EMIT TYPING EVENT

  onUserTyping() {
    this.emitUserTyping();
    
    // Reset the debounce timer
    this.typingSubject.next();
  }

  emitUserTyping() {
    this.chatService.sendUserTypingEvent(this.currentUser, this.selectedChat.people_id);
  }

  emitUserStoppedTyping() {
    this.chatService.sendUserStoppedTypingEvent(this.currentUser, this.selectedChat.people_id);
  }



    // // get last seen
    getLastSeen(){
      const payload = {
       user_id : this.selectedChat.people_id
      }
      this.chatService.getLastSeen(payload).subscribe((res:any)=>{
        this.lastSeen = res.data.sys_last_login
        console.log('this.lastSeen', this.lastSeen)
      })
     }

     ngAfterViewInit() {
      setTimeout(() => this.scrollToBottom(), 300); // Delay allows messages to load first
    }

  // ngOnChanges() {
  // }

  checkScroll() {

  }

  scrollToBottom() {
    if (this.scroll) {
      setTimeout(() => {
        this.scroll.nativeElement.scrollTo({
          top: this.scroll.nativeElement.scrollHeight,
          behavior: 'smooth' // Enables smooth scrolling
        });
      }, 300); // Small delay ensures the DOM is updated
    }
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
        // this.listenForMessages();
        this.messageHistory();
      }, 500); 
    }

    // RECEIVE MESSAGES
    receiveMessage(){
      this.chatService.receiveMessages().subscribe((res:any)=>{
        console.log('recievemesssge',res)
        // this.messages.push(res)
        if(res?.sender_id == this.selectedChat?.people_id){
          this.messages.push(res)
          console.log('this is running')
          this.chatService.emitCheckMessageEvent(this.selectedChat?.people_id);
        }
        this.newMessages.emit(res);
        this.scrollToBottom();
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
  // listenForMessages() {
  //   this.chatService.listenForMessages().subscribe((message) => {
  //     // this.messages.push(message);
  //   });
  // }

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
      // this.messages.push({
      //   sender_id: this.currentUser,
      //   message : this.newMessage,
      //   receiver_id : this.selectedChat.people_id,
      //   timestamp : Date.now()
      // })
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
    this.typingSubject.unsubscribe();
  }
  
  logout(){
    this.storageService.removeItem('user');
    this.router.navigate(['/login'])
    }

    // GET ONLINE STATUS
    getOnlineUsers(){
      this.chatService.getOnlineUsers().subscribe((users:any) => {
        // this.onlineUsers.push(users);
        if(users?.users?.includes(this.selectedChat?.people_id)){
          this.isUserOnline = true;
        } else {
          this.isUserOnline = false;
        }
      });
      
     
    }

    getOfflineUsers(){
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
      // }
    }

    // check user online
    // checkUserOnline(){
    // if(this.onlineUsers.includes(this.selectedChat.people_id)){
    //   return "Online"
    // } else{
    //   return "Offline";
    // }
    // }

    // READ MESSAGES WHEN CHAT
    readMessages(){
        // this.chatService.messageSeen()
    }
    messageId:any

    getUnseenMessages(){
      this.chatService.getUnseenMessages().subscribe((res:any)=>{
        this.messageId = res;
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

    // DELETE MESSAGE
    deleteMessage(message:any, index: number): void {
      this.chatService.emitDeleteMessage({messageId : message.message_id})
      // Confirm deletion
      // const confirmDelete = confirm('Are you sure you want to delete this message?');
      // if (confirmDelete) {
      //   // Remove message from the array
      //   this.messages.splice(index, 1);
      // }
    }

    // GET DELETE MESSAGES
    getDeleteMessages(){
      this.chatService.getDeleteMessages().subscribe((deleteMessages:any)=>{
        const index = this.messages.findIndex(msg => msg?.message_id === deleteMessages?.messageId);
        if (index !== -1) {
          // Temporarily remove the message from the UI (optimistic UI update)
          const deletedMessage = this.messages.splice(index, 1)[0];

        }    
        // console.log("dleltemessage", deleteMessages)
      })
    }


    // GET SENDER MESSAGE
    getSenderMessage(){
      this.chatService.getSenderMessage().subscribe((senderMessage:any)=>{
        if(senderMessage){
        this.messages.push(senderMessage);
        }
      })
    }

    // TOOGLE FAVORITE MESSAGE
    toggleFavorite(message: any) {
      message.favorite_msg= !message.favorite_msg;
      this.chatService.emitFavoriteMessage(message.message_id, message.favorite_msg)
    }

    // GET FAVORITE MESSAGE
    getFavoriteMessage(){
      this.chatService.getFavoriteMessage().subscribe((favoriteMessage:any)=>{
      })
    }

    // GET USER TYPING
    getUserTyping(){
      this.chatService.getUserTyping().subscribe((usertypingSenderId:any)=>{
        if(usertypingSenderId == this.selectedChat.people_id){
          this.isUserTyping = true;
          console.log('isusertyping', this.isUserTyping)
        }
      })
    }

    // GET USER STOP TYPING ID
    getUserStoppedTyping(){
      this.chatService.getUserStoppedTyping().subscribe((usertypingStoppedId:any)=>{
        if(usertypingStoppedId == this.selectedChat.people_id){
          this.isUserTyping = false;
        }
      })
    }

    // archivedMessages: any[] = []; 

    // archieve the messge
    archiveMessage(message: any, index: number) {
      // Remove the message from the active messages list
      this.messages = this.messages.filter(msg => msg.message_id !== message.message_id);
    this.chatService.emitArchieveMessage({messageId : message.message_id})

    }

    // SHOW ARCHIEVE MESSAGES
    toggleArchivedMessages() {
      this.showArchived = !this.showArchived;
      this.messageHistory();
    }
    
    
    get filteredMessages(): any[] {
      if (this.showArchived) {
        // Return only archived messages (assuming archived messages have is_message_archive set to 1)
        return this.messages.filter(message => message.is_message_archive === 1);
      } else {
        // Return only regular (non-archived) messages (assuming regular messages have is_message_archive set to 0 or falsy)
        return this.messages.filter(message => message.is_message_archive !== 1);
      }
    }

  
}
