import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from '../../model/member';
import { MembersService } from '../../services/members.service';
import { ActivatedRoute } from '@angular/router';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { MessageService } from '../../services/message.service';
import { Message } from '../../model/message';
import { PresenceService } from '../../services/presence.service';
import { AccountService } from '../../services/account.service';
import { User } from '../../model/user';
import { take } from 'rxjs';
@Component({
  selector: 'app-member-detail',
  standalone: true,
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css',
  imports: [CommonModule, NgbNavModule, GalleryModule, TimeagoModule, MemberMessagesComponent]
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild("nav", { static: true }) ngbNav?: NgbNav;
  messages: Message[] = [];
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  user?:User;
  constructor(
    public presenceService: PresenceService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private accountService: AccountService) {
      accountService.currentUser$.pipe(take(1)).subscribe({
        next: user =>{
          if(user){
            this.user = user;
          }
        }
      })
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => this.member = data['member']
    })
    this.route.queryParams.subscribe({
      next: params => {       
        params['tab'] && this.selectTab(parseInt(params['tab']))
      }
    })
    this.getImages();

  }
  onTabActivated(id: any) {
    const MESSAGE_TAB = 4;
    if (id == MESSAGE_TAB && this.user) {
      //this.loadMessage();
      this.messageService.createHubConnection(this.user, this.member.userName);
    }
    else{
      this.messageService.stopHubConnection();
    }
  }

  loadMessage() {
    if (this.member) {
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: messages => this.messages = messages
      })
    }
  }
  getImages() {
    if (!this.member) return;

    for (const photo of this.member.photos) {
      this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
    }
  }
  selectTab(id: number) {
    this.ngbNav?.select(id);
  }
}
