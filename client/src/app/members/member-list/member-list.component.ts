import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from '../../model/member';
import { MembersService } from '../../services/members.service';
import { MemberCardsComponent } from '../member-card/member-card.component';
import { Observable, take } from 'rxjs';
import { Pagination } from '../../model/pagination';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { UserParams } from '../../model/userParams';
import { AccountService } from '../../services/account.service';
import { User } from '../../model/User';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, MemberCardsComponent, NgbPaginationModule, FormsModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  pagination: Pagination | undefined;
  userParams: UserParams | undefined;
  genderList = [
    { value: 'male', display: 'Males' },
    {
      value: 'female', display: 'Females'
    }]
  constructor(private memberService: MembersService) {
    this.userParams = memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }
  orderByLastActive() {
    if (!this.userParams) return;

    this.userParams.orderBy = 'lastActive';
    this.loadMembers();
  }
  orderByCreated() {
    if (!this.userParams) return;

    this.userParams.orderBy = 'created';
    this.loadMembers();
  }
  loadMembers() {
    console.log(this.userParams);

    if (this.userParams) {
      this.memberService.setUserParams(this.userParams);
      this.memberService.getMembers(this.userParams).subscribe({
        next: response => {
          if (response.result && response.pagination) {
            this.members = response.result;
            this.pagination = response.pagination;
          }
        }
      });
    }
  }

  resetFilter() {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }

  pageChange(page: any) {
    if (this.userParams && this.userParams?.pageNumber !== page) {
      this.userParams.pageNumber = page;
      this.memberService.setUserParams(this.userParams);
      this.loadMembers();
    }
  }
}
