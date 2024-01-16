import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-roles-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles-modal.component.html',
  styleUrl: './roles-modal.component.css'
})
export class RolesModalComponent {
  constructor(public activeModal: NgbActiveModal) { }
  @Input() username = '';
  @Input() availableRoles: any[] = [];
  @Input() selectedRoles: any[] = [];
  updateChecked(checkedValue: string){
    const index = this.selectedRoles.indexOf(checkedValue);
    index !== -1 ? this.selectedRoles.splice(index, 1):this.selectedRoles.push(checkedValue);
  }
  submit(){
    this.activeModal.close(this.selectedRoles)
  }
}
