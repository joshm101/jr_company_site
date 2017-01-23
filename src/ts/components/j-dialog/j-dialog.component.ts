import { Component, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'j-dialog',
  templateUrl: 'ts/components/j-dialog/j-dialog.component.html'
})
export class JDialogComponent {
  constructor(
    public dialogRef: MdDialogRef<JDialogComponent>
  ) {

  }

  @Input() dialogTitle: string = "Title";
}
