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

  constructor(private _apiService : ApiService) {
    this.connect();
  }

  private connect(): void {
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
    this.socket.on('receive_message', (message) => {
      this.messages.next([...this.messages.value, message]);
    });
    this.socket.on('user_typing', (data) => {
      console.log(`User ${data.senderId} is typing...`);
    });
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

  // sendMessage(message: string): void {
  //   if (this.socket.connected) {
  //     this.socket.emit('message', message);
  //   } else {
  //     console.warn('WebSocket is not connected.');
  //   }
  // }
  sendMessage(senderId: string, receiverId: string, message: string) {
    console.log('senderId',senderId);
    console.log('receiverId',receiverId)
    this.socket.emit('send_message', { senderId, receiverId, message });
  }
  sendTyping(senderId: string, receiverId: string) {
    this.socket.emit('typing', { senderId, receiverId });
  }

  markMessageAsRead(messageId: string, userId: string) {
    this.socket.emit('read_message', { messageId, userId });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  getUsers(){
      return this._apiService.getAll(apiRoutes.userList)
    }
}
