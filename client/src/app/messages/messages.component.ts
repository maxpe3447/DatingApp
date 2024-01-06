import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../model/message';
import { Pagination } from '../model/pagination';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit{
  messages?: Message[];
  pagination?: Pagination;
  container = 'Outbox';
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
}
