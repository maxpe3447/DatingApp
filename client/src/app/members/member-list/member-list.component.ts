import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from '../../model/member';
import { MembersService } from '../../services/members.service';
import { MemberCardsComponent } from '../member-card/member-card.component';
import { Observable } from 'rxjs';
import { Pagination } from '../../model/pagination';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, MemberCardsComponent],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  // members$: Observable<Member[]> | undefined;
  members: Member[] = [];
  pagination: Pagination | undefined;
  pageNumber = 1;
  pageSize = 5;

  constructor(private memberService: MembersService){}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(){  
    this.memberService.getMembers(this.pageNumber, this.pageSize).subscribe({
      next:response =>{
        console.log(this.pagination);
        if(response.result && response.pagination){
          this.members = response.result;
          this.pagination = response.pagination;
          
        }
      }
    });
  }
}
