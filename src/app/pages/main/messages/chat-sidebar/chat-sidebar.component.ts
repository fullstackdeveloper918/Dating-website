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
    this.messageCountApi();
    this.getOfflineUsers();
  }




  // increase count
  increaseCount(chat:any){
   console.log('chat',chat)
  }
  
  selectChat(chat: any) {
    this.chatSelected.emit(chat);
    this.selectedChat = chat; 
    this.clearCount(chat);
    // this.getLastSeen(this.selectedChat.people_id)
    // this.getUsers();
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
    // this.getLastSeen(this.selectedChat.people_id)
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
    console.log("senderName",senderName)
    this.toast.success(`${senderName}: ${messageText}`, 'New Message', {
      timeOut: 3000, // Adjust timeout as needed
      positionClass: 'toast-top-right',
    });
  }

  // MESSAGE COUNT API
  messageCountApi() {
    this._chatService.getOfflineMessagesAndCounter().subscribe((res: any) => {
      console.log('res', res);
  
      if (res.status === 200 && Array.isArray(res.data)) {
        res.data.forEach((msg: any) => {
          if (msg.senderId && msg.count) {
            console.log('Updating count for sender:', msg.senderId);
            let senderId = msg.senderId;
            let count = parseInt(msg.count, 10); // Convert count to a number
  
            // Update unreadCounts by increasing the count
            this.unreadCounts[senderId] = (this.unreadCounts[senderId] || 0) + count;
          }
        });
  
        console.log('Updated unreadCounts:', this.unreadCounts);
      }
    });
  }

  // hitting the api 
  getOfflineUsers(){
    this._chatService.getOfflineUsers().subscribe((user) => {
      console.log('offlineuser', user)
      if(user){
          this.getUsers();
      }
    }); 
  }
  
}
