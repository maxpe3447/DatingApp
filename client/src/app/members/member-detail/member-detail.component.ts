import { Component, OnInit, ViewChild } from '@angular/core';
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
@Component({
  selector: 'app-member-detail',
  standalone: true,
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css',
  imports: [CommonModule, NgbNavModule, GalleryModule, TimeagoModule, MemberMessagesComponent]
})
export class MemberDetailComponent implements OnInit {
  @ViewChild("nav", { static: true }) ngbNav?: NgbNav;
  messages: Message[] = [];
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  constructor(
    public presenceService: PresenceService,
    private route: ActivatedRoute,
    private messageService: MessageService) {

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
    if (id == 4) {
      this.loadMessage();
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
