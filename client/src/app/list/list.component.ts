import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { Member } from '../model/member';
import { MembersService } from '../services/members.service';
import { FormsModule } from '@angular/forms';
import { MemberCardsComponent } from "../members/member-card/member-card.component";

@Component({
    selector: 'app-list',
    standalone: true,
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
    imports: [CommonModule, FormsModule, MemberCardsComponent]
})
export class ListComponent implements OnInit {
  members: Member[] | undefined;
  predicate = 'liked';
  constructor(private memberService: MembersService){}
  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes(){
    this.memberService.getLikes(this.predicate).subscribe({
      next: response => {
        this.members = response
      }
    })
  }
  likedClick(){
    this.predicate = 'liked';
    this.loadLikes();
  }
  likedByClick(){
    this.predicate = 'likedBy';
    this.loadLikes();
  }
}
