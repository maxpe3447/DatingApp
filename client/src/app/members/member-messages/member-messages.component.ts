import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../model/message';
import { MessageService } from '../../services/message.service';
import { TimeagoModule } from 'ngx-timeago';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [CommonModule, TimeagoModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent implements OnInit{
  @Input() usernamae?: string;
  messages: Message[]  = [];

  constructor(private messageService:MessageService){}
  ngOnInit(): void {
    this.loadMessage();
  }

  loadMessage(){
    if(this.usernamae){
      this.messageService.getMessageThread(this.usernamae).subscribe({
        next: messages => this.messages = messages
      })
    }
  }
}
