import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ChatService } from 'src/app/core/service/chat.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss']
})
export class ChatSidebarComponent {
  @Input() newMessage:any
  selectedChat:any
  chatList : any[] = [
  ];
  onlineUsers:any
  latestMessage: any = null;
  unreadCounts: { [key: number]: number } = {};
  private destroy$ = new Subject<void>();


  @Output() chatSelected = new EventEmitter<any>();

  constructor(
  private _chatService : ChatService,
  private toast: ToastrService){
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes['newMessage'] && changes['newMessage'].currentValue) {
    //   this.latestMessage = changes['newMessage'].currentValue;

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


  getUsers(search?: string) {
    let params = new HttpParams();
    
    if (search) {
      params = params.set('search', search); // Assuming API supports search param
    }
  
    this._chatService.getUsers(params).subscribe((user: any) => {
      if (!search) {
        this.chatList = user?.data || [];
        if (this.chatList.length > 0) {
          this.selectedChat = this.chatList[0];
          this.chatSelected.emit(this.selectedChat);
        }
      } else {
        this.chatList = user.data || []
      }
    }, error => {
      console.error("Error fetching users", error);
    });
  }
  



  // GET ONLINE USERS
  getOnlineUsers(){
    this._chatService.getOnlineUsers().subscribe((users:any) => {
      this.onlineUsers = users.users
    })
  }

  // increase counter 

  receiveMessage() {
    this._chatService.receiveMessages()
      .pipe(takeUntil(this.destroy$)) // Automatically unsubscribes when the component is destroyed
      .subscribe((res: any) => {
        this.latestMessage = res;
        if (this.latestMessage?.sender_id && this.latestMessage.sender_id !== this.selectedChat.people_id) {
          const sender = this.chatList.find((user: any) => user.people_id === this.latestMessage.sender_id);
          const senderName = sender ? sender.username : 'Unknown';

          this.showNotification(senderName, this.latestMessage.message);

          if (!this.unreadCounts[this.latestMessage.sender_id]) {
            this.unreadCounts[this.latestMessage.sender_id] = 0;
          }
          this.unreadCounts[this.latestMessage.sender_id]++;
        }
      });
  }


    // SHOW NOTIFICATION
    showNotification(senderName: string, messageText: string) {
      this.toast.success(`${senderName}: ${messageText}`, 'New Message', {
        timeOut: 3000, // Adjust timeout as needed
        positionClass: 'toast-top-right',
      });
    }

  // MESSAGE COUNT API
  messageCountApi() {
    this._chatService.getOfflineMessagesAndCounter().subscribe((res: any) => {  
      if (res.status === 200 && Array.isArray(res.data)) {
        res.data.forEach((msg: any) => {
          if (msg.senderId && msg.count) {
            let senderId = msg.senderId;
            let count = parseInt(msg.count, 10); // Convert count to a number
  
            // Update unreadCounts by increasing the count
            this.unreadCounts[senderId] = (this.unreadCounts[senderId] || 0) + count;
          }
        });
        }
    });
  }

  // hitting the api 
  getOfflineUsers(){
    this._chatService.getOfflineUsers().subscribe((user) => {
      if(user){
          // this.getUsers();
      }
    }); 
  }

  // search users
  search(event:any){
    this.getUsers(event.target.value)
  }
  
}
