import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { apiUrl } from 'src/environment';
import { ApiService } from './api.service';
import { apiRoutes } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket!: Socket;
  private connectionStatus = new BehaviorSubject<string>('Disconnected');
  private messages = new BehaviorSubject<any[]>([]);
  private onlineUsers = new BehaviorSubject<any[]>([]); 
  private offlineUsers = new BehaviorSubject<any | null>(null); // Store offline user
  unSeenMessages = new BehaviorSubject<any | null>(null);
  receiveMessage = new BehaviorSubject<any | null>(null);
  deleteMessage = new BehaviorSubject<any | null>(null);
  senderMessage = new BehaviorSubject<any | null>(null);
  favoriteMessages = new BehaviorSubject<any | null>(null);



  constructor(private _apiService : ApiService) {
    this.connect();
  }

   connect(): void {
    this.socket = io(apiUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,  
      timeout: 5000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket');
      this.connectionStatus.next('Connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
      this.connectionStatus.next('Disconnected');
    });

    // this.socket.on('message', (message: any) => {
    //   console.log('New message received:', message);
    //   this.messages.next([...this.messages.value, message]);
    // });
    this.socket.on('receive_message', (data) => {
      console.log('data',data)
      // this.messages.next([...this.messages.value, message]);
    });
    this.socket.on('user_typing', (data) => {
      console.log(`User ${data.senderId} is typing...`);
    });
    this.socket.on('unseen_message_count', (data)=>{
      console.log('unseen message count', data)
    })

     // Listen for online users
     this.socket.on('update_user_count', (users: any[]) => {
      console.log('online uers',users)
      this.onlineUsers.next(users); // Update observable
    });

    // Listen for offline user
    this.socket.on('user_offline', (user: any) => {
      this.offlineUsers.next(user); // Update observable
    });

    this.socket.on('message_seen', (data:any)=>{
      this.unSeenMessages.next(data)
      console.log('messageseen',data)
    })

    // this.socket.on('unseen_count',(data:any)=>{
    //   console.log('data',data)
    // })
    
    // this.socket.on('unseen_message_count', (data:any)=>{
    //   console.log('unseen message count',data)
    // })

    this.socket.on('receive_message', (data)=>{
      this.receiveMessage.next(data)
      // console.log('data', data);
    })

    this.socket.on('message_deleted', (deleteMessage)=>{
      this.deleteMessage.next(deleteMessage)
    })

    this.socket.on('sender_message', (senderMessge)=>{
      this.senderMessage.next(senderMessge)
    })

    this.socket.on('message_favorited', (favoriteMessage)=>{
      this.favoriteMessages.next(favoriteMessage)
    })



  }

  // GET FAVORITE MESSAGE
  getFavoriteMessage(){
    return this.favoriteMessages.asObservable();
  }

  // GET SENDER MESSAGE
  getSenderMessage(){
    return this.senderMessage.asObservable();
  }

  // GET DELETE MESSAGES

  getDeleteMessages(){
    return this.deleteMessage.asObservable();
  }

  // GET UNSEEN MESSAGES
  getUnseenMessages(){
    return this.unSeenMessages.asObservable();
  }


  // receive message
  receiveMessages(){
    return this.receiveMessage.asObservable();
  }



    /** GET ONLINE USERS AS OBSERVABLE */
    getOnlineUsers(): Observable<any[]> {
      return this.onlineUsers.asObservable();
    } 
  
    /** GET OFFLINE USER AS OBSERVABLE */
    getOfflineUsers(): Observable<any | null> {
      return this.offlineUsers.asObservable();
    }


  registerUser(userId: string) {
    this.socket.emit('register', userId);
  }

  getConnectionStatus(): Observable<string> {
    return this.connectionStatus.asObservable();
  }

  getMessages(): Observable<any[]> {
    return this.messages.asObservable();
  }

  sendMessage(senderId: any, recipientId :any ,message: string): any {
    if (this.socket.connected) {
      this.socket.emit('private_message',{ senderId, recipientId, message });
    } else {
      console.warn('WebSocket is not connected.');
    }
    // this.listenForMessages();
  }
  // sendMessage(senderId: string, receiverId: string, message: string) {
  //   this.socket.emit('send_message', { senderId, receiverId, message });
  // }
  sendTyping(senderId: string, receiverId: string) {
    this.socket.emit('typing', { senderId, receiverId });
  }

  markMessageAsRead(messageId: string, userId: string) {
    this.socket.emit('read_message', { messageId, userId });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners(); // Remove all event listeners
      this.socket.disconnect();
      console.log("Socket disconnected.");
    }
  }

  getUsers(){
      return this._apiService.getAll(apiRoutes.userList)
    }

    listenForMessages(): Observable<string> {
      return new Observable((observer) => {
        this.socket.on('receive_message', (data) => {
          console.log('data',data)
          // console.log('this.messages',this.messages)
          this.messages.next(data);
          // console.log('this.messages', this.messages)
        });
  
        return () => {
          this.socket.off('message');
        };
      });
    }

    // GET CHAT HISTORY
  getMessageHistory(payload:any){
   return this._apiService.post(apiRoutes.message_list, payload)
  }

  // MARK AS SEEN
  viewMessage(senderId:any, recipientId:any){
    console.log('senderId',senderId)
    setTimeout(()=>{
      this.socket.emit('mark_as_seen', {senderId, recipientId})
    }, 5000)
  }

  // Emit seen message event
  seenMessage(messageId:any){
    console.log('messageId1', messageId)
    setTimeout(()=>{
      console.log('messageId2', messageId)
      this.socket.emit('message_seen',messageId)
    },2000)
    // this.getMessageHistory();
  }

  // EMIT CHECK MESSAGE EVENT
  emitCheckMessageEvent(selectedChatId:any){
   console.log('seletechat',selectedChatId.people_id)
   setTimeout(() => {  
    this.socket.emit('check_messages', selectedChatId.people_id)
   }, 2000);
  }


  // GET ONINE MESSAGES AND COUNTER
  getOfflineMessagesAndCounter(){
   return this._apiService.getAll(apiRoutes.unseenMessageCount)
  }

  // EMIT DELETE MESSAGE
  emitDeleteMessage(messageId:any){
    return this.socket.emit('delete_message', messageId)
  }

  // EMIT FAVORITE MESSAGE
  emitFavoriteMessage(messageId:any, favorite_message:any){
  console.log('messageId', messageId);
  console.log('favoritemessage', favorite_message)
  return this.socket.emit('favorite_message',{messageId : messageId, favorite_msg: favorite_message} )
  }

  // get last seen
  getLastSeen(userId:any){
  return this._apiService.post(apiRoutes.getLastSeen,userId )
  }

}
