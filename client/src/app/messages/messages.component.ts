import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../model/message';
import { Pagination } from '../model/pagination';
import { MessageService } from '../services/message.service';
import { TimeagoModule } from 'ngx-timeago';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, TimeagoModule, NgbPaginationModule, RouterModule, RouterLink],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit{
  messages?: Message[];
  pagination?: Pagination;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;

  constructor(private messageService:MessageService){}
  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(){
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe({
      next: response => {
        this.messages = response.result;
        this.pagination = response.pagination;
      }
    });
  }
  pageChanged(event:any){
    if(this.pageNumber!==event){
      this.pageNumber = event;
      this.loadMessages();
    }
  }

  unreadClick(){
    this.container = "Unread";
    this.loadMessages();
  }
  inboxClick(){
    this.container = "Inbox";
    this.loadMessages();
  }
  outboxClick(){
    this.container = "Outbox";
    this.loadMessages();
  }
  pageChange(page:any){

  }
}
