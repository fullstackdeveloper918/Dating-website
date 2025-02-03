import { Component } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent {
  currentChat: any;

  onChatSelected(chat: any) {
    this.currentChat = chat;
  }


  // connectionStatus: string = 'Disconnected';
  // messages: any[] = [];
  // newMessage: string = '';  // Add this line to declare 'newMessage'
  // serverUrl = apiUrl; // Replace with your WebSocket URL
  // constructor() {}
  // ngOnInit(): void {
  //   this.connect();
  // }
  // private connect(): void {
  //   this.socket = io(this.serverUrl, {
  //     transports: ['websocket'], // Ensures WebSocket connection
  //     reconnection: true, // Auto-reconnect on disconnect
  //     reconnectionAttempts: 5, // Number of reconnect attempts
  //     timeout: 5000 // Timeout for connection
  //   });
  //   this.socket.on('connect', () => {
  //     this.connectionStatus = 'Connected';
  //   });
  //   this.socket.on('disconnect', () => {
  //     this.connectionStatus = 'Disconnected';
  //   });
  //   this.socket.on('message', (message: any) => {
  //     this.messages.push(message);
  //   });
  // }
  // // Send a message to the server
  // sendMessage(message: string): void {
  //   if (this.socket.connected) {
  //     this.socket.emit('message', message);
  //     this.newMessage = '';  // Clear input field after sending the message
  //   } else {
  //     console.warn('WebSocket is not connected.');
  //   }
  // }
  // ngOnDestroy(): void {
  //   if (this.socket) {
  //     this.socket.dis
}
