import { Component, ViewChild, Inject } from '@angular/core';
import { MdButton, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-interface-post-delete-confirm-dialog',
  templateUrl: './interface-post-delete-confirm-dialog.component.html',
  styleUrls: ['./interface-post-delete-confirm-dialog.component.css']
})
export class InterfacePostDeleteConfirmDialogComponent {
  constructor(
    private dialogRef: MdDialogRef<InterfacePostDeleteConfirmDialogComponent>
  ) { }

  confirmDelete(event: Event) {
    this.dialogRef.close(true);
  }

  cancelDelete(event: Event) {
    this.dialogRef.close(false);
  }

}
