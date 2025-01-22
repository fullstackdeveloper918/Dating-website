import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagesRoutingModule } from './messages-routing.module';
import { ChatSidebarComponent } from './chat-sidebar/chat-sidebar.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { MessagesComponent } from './messages/messages.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ChatSidebarComponent,
    ChatWindowComponent,
    MessagesComponent
  ],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    FormsModule
  ]
})
export class MessagesModule { }
