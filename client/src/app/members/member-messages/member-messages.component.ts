import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../model/message';
import { MessageService } from '../../services/message.service';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  standalone: true,
  imports: [CommonModule, TimeagoModule, FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm?:NgForm;
  @Input() username?: string;
  messageContetn = '';
  constructor(public messageService: MessageService) { }
  ngOnInit(): void { }

  sendMessage() {
    if (!this.username) {
      return;
    }
    this.messageService.sendMessage(this.username, this.messageContetn).then(()=>{
      this.messageForm?.reset();
    });
  }
}
