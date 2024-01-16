import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { Member } from '../model/member';
import { MembersService } from '../services/members.service';
import { FormsModule } from '@angular/forms';
import { MemberCardsComponent } from "../members/member-card/member-card.component";
import { Pagination } from '../model/pagination';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-list',
    standalone: true,
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
    imports: [CommonModule, FormsModule, MemberCardsComponent, NgbPaginationModule]
})
export class ListComponent implements OnInit {
  members: Member[] | undefined;
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination | undefined;
  constructor(private memberService: MembersService){}
  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes(){
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.members = response.result;
        this.pagination = response.pagination        
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
  pageChange(page: any) {
    if (this.pageNumber !== page) {
      this.pageNumber = page;
      this.loadLikes();
    }
  }
}
