import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { HasRoleDirective } from '../../_directives/has-role.directive';
import { UserManagmentComponent } from "../user-managment/user-managment.component";
import { PhotoEditorComponent } from "../../members/photo-editor/photo-editor.component";
import { AccountService } from '../../services/account.service';
import { AdminService } from '../../services/admin.service';

@Component({
  schemas: [NO_ERRORS_SCHEMA],
  selector: 'app-admin-panel',
  standalone: true,
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
  imports: [CommonModule, NgbNavModule, UserManagmentComponent, PhotoEditorComponent, HasRoleDirective]
})
export class AdminPanelComponent{
  constructor(){ }
}
