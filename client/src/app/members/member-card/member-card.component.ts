import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from '../../model/member';
import { RouterLink } from '@angular/router';
import { MembersService } from '../../services/members.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardsComponent {
 @Input() member:Member | undefined;

  constructor(private memberService:MembersService,
              private toastr: ToastrService){}

  addLike(member: Member){
    this.memberService.addLike(member.userName).subscribe({
      next: () => this.toastr.success("You have liked "+member.knownAs)
    });
  }
}
