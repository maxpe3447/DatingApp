import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../model/user';
import { AdminService } from '../../services/admin.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-managment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-managment.component.html',
  styleUrl: './user-managment.component.css'
})
export class UserManagmentComponent implements OnInit {
  users: User[] = [];
  availableRoles = [
    'Admin',
    'Moderator',
    'Member'
  ]
  constructor(private adminService: AdminService, private modalService: NgbModal) { }
  ngOnInit(): void {
    this.getUserWithRoles();
  }
  getUserWithRoles() {
    this.adminService.getUserWithRoles().subscribe({
      next: users => {
        this.users = users;
      }
    })
  }
  openRolesModel(user: User) {

    const modalRef = this.modalService.open(RolesModalComponent);
    modalRef.componentInstance.username = user.username;
    modalRef.componentInstance.availableRoles = this.availableRoles;
    modalRef.componentInstance.selectedRoles = [...user.roles];
    modalRef.result.then(
      result => {
        const selectedRoles = (result);
        if(!this.arrayEqual(selectedRoles, user.roles)){
          this.adminService.updateUserRoles(user.username, selectedRoles).subscribe({
            next: roles => user.roles = roles
          });
        }
      }
    );
  }
  private arrayEqual(arr1: any[], arr2: any[]) {
    return JSON.stringify(arr1.sort()) == JSON.stringify(arr2.sort());
  }
}
