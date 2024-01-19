import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  modalRef?: NgbModalRef;
  constructor(private modalService: NgbModal) { }

  confirm(
    title = 'Confirmation',
    message = 'Are you sure you want to do this?',
    btnOkText = 'Ok',
    btnCancelText = 'Cancel'
  ): Observable<boolean> {
    this.modalRef = this.modalService.open(ConfirmDialogComponent)

    this.modalRef.componentInstance.Title = title;
    this.modalRef.componentInstance.message = message;
    this.modalRef.componentInstance.btnOkText = btnOkText;
    this.modalRef.componentInstance.btnCancelText = btnCancelText;

    return from(this.modalRef.result).pipe(map((result) => {
      return result;
    }))
  }
}
