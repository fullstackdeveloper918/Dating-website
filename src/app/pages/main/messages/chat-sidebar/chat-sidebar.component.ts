import { Component, EventEmitter, Input, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ChatService } from 'src/app/core/service/chat.service';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss']
})
export class ChatSidebarComponent {
  @Input() newMessage:any
  searchTerm: string = '';
  selectedChat:any
  chatList : any[] = [
  ];
  onlineUsers:any
  latestMessage: any = null;
  unreadCounts: { [key: number]: number } = {};

  @Output() chatSelected = new EventEmitter<any>();

  constructor(
  private _chatService : ChatService,
  private toast: ToastrService){
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes['newMessage'] && changes['newMessage'].currentValue) {
    //   this.latestMessage = changes['newMessage'].currentValue;
    //   console.log('Updated latestMessage:', this.latestMessage);

    //   // Increase the count for the matching chat.people_id
    //   if (this.latestMessage?.sender_id) {
    //     if (!this.unreadCounts[this.latestMessage.sender_id]) {
    //       this.unreadCounts[this.latestMessage.sender_id] = 0;
    //     }
    //     this.unreadCounts[this.latestMessage.sender_id]++; 
    //   }
    // }
  }


  ngOnInit(){
    this.getUsers();
    this.getOnlineUsers();
    this.receiveMessage();
    // this.messageCountApi();
  }


  // increase count
  increaseCount(chat:any){
   console.log('chat',chat)
  }
  
  selectChat(chat: any) {
    this.chatSelected.emit(chat);
    this.selectedChat = chat; 
    this.clearCount(chat);
  }

  clearCount(chat: any) {
    if (this.unreadCounts[chat.people_id]) {
      this.unreadCounts[chat.people_id] = 0; 
    }
  }


  getUsers(){
   this._chatService.getUsers().subscribe((user:any)=>{
    this.chatList = user.data;
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
    })
  }

  // increase counter 

  receiveMessage(){
    this._chatService.receiveMessages().subscribe((res:any)=>{
      // this.messages.push(res)
      this.latestMessage = res;
      console.log('Updated latestMessage:', this.latestMessage);

      // Increase the count for the matching chat.people_id
      if (this.latestMessage?.sender_id && this.latestMessage.sender_id!=this.selectedChat.people_id) {
        const sender = this.chatList.find((user: any) => user.people_id === this.latestMessage.sender_id);
        const senderName = sender ? sender.username : 'Unknown';
  
        // Show toast notification with sender's name
        this.showNotification(senderName, this.latestMessage.message);
        if (!this.unreadCounts[this.latestMessage.sender_id]) {
          this.unreadCounts[this.latestMessage.sender_id] = 0;
        }
        this.unreadCounts[this.latestMessage.sender_id]++; 
      }
    })
  }

  // SHOW NOTIFICATION
  showNotification(senderName: string, messageText: string) {
    this.toast.success(`${senderName}: ${messageText}`, 'New Message', {
      timeOut: 3000, // Adjust timeout as needed
      positionClass: 'toast-top-right',
    });
  }

  // MESSAGE COUNT API
  // messageCountApi(){
  //   this._chatService.getOfflineMessagesAndCounter()
  // }
}
