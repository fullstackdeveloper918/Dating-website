import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesRoutingModule } from './messages-routing.module';
import { ChatSidebarComponent } from './chat-sidebar/chat-sidebar.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { MessagesComponent } from './messages/messages.component';
import { FormsModule } from '@angular/forms';
import { TimeAgoPipe } from 'src/app/core/pipe/time-ago.pipe';
import {MatMenuModule} from '@angular/material/menu';
@NgModule({
  declarations: [
    ChatSidebarComponent,
    ChatWindowComponent,
    MessagesComponent,
    TimeAgoPipe,
  ],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    FormsModule,
    MatMenuModule
  ]
})
export class MessagesModule { }