import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  @Input() title = '';
  @Input() message = '';
  @Input() btnOkText = '';
  @Input() btnCancelText = '';
  result = false;
  constructor(public activeModal: NgbActiveModal) { }

  confirm(){
    this.result = true;
    this.activeModal.close(true);
  }

  decline(){
    this.activeModal.close(false);
  }
}
