import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ChatService } from 'src/app/core/service/chat.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StorageService } from 'src/app/core/service/storage/storage.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  currentUser:any
  currentUserName:any
  currentUserFirstLetter:any
  userId:any
  allChatFalse:any
  @Output() chatSelected = new EventEmitter<any>();

  constructor(
  private _chatService : ChatService,
  private toast: ToastrService,
  private storageService : StorageService,
  private route : ActivatedRoute,
  private router: Router){
    const user :any = this.storageService.getItem("user");
    this.currentUser = user.data.people_id
    this.currentUserName = user.data.username
    this.currentUserFirstLetter = user.data.username.charAt(0).toUpperCase();

    this.route.queryParams.subscribe(params => {
      const userId = params['id'];
      if (userId) {
        this.userId = userId;
        console.log('Chatting with user ID:', userId);
        
        // Clear query params after processing them
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true  
        });
      }
    });
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
          if(!this.userId){
            this.allChatFalse = this.chatList.every(chat => chat.has_chat === 0);
          // this.selectedChat = this.chatList[0];
          // this.chatSelected.emit(this.selectedChat);
          }else{
            // this.selectedChat = this.userId;
            this.selectedChat = this.chatList.find(userList => this.userId == userList.people_id);
            this.chatSelected.emit(this.selectedChat)
          }
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
          this.chatList.forEach(chat => {
            if (chat.people_id === res.sender_id) {
              chat.has_chat = 1;
            }
          });
          this.chatList = this.chatList;       
        this.latestMessage = res;
        if (this.latestMessage?.sender_id && this.latestMessage.sender_id !== this.selectedChat?.people_id) {
          const sender = this.chatList.find((user: any) => user.people_id === this.latestMessage.sender_id);
          if(!sender) return;
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
      this.toast.info(`${senderName}: ${messageText}`, 'New Message', {
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

  // getter function for chatList

get filteredChatList() {
  if (!this.userId) {
    return this.chatList.filter(chat => chat.has_chat === 1);
  } else {
    const newArray =  this.chatList
      .map(chat => {
        if (chat.people_id == this.userId) {
          chat.has_chat = 1;
        }
        return chat;
      })
      return newArray.filter((chat:any) => chat.has_chat === 1);
  }
}

// GO TO HOME PAGE
goToHomePage(){
  this.router.navigate(['/main/home'])
}
  
}


