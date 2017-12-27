import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-instagram-auth-request-dialog-status-text',
  templateUrl: './instagram-auth-request-dialog-status-text.component.html',
  styleUrls: ['./instagram-auth-request-dialog-status-text.component.css']
})
export class InstagramAuthRequestDialogStatusTextComponent implements OnInit {
  @Input()
  public text: string;
  @Input()
  public isDiscreteEvent: boolean = false;
  @Input()
  public textAlign: string = 'center';
  @Input()
  paddingAmount: number = 0;
  constructor() { }

  ngOnInit() {
  }

  get paddingString() {
    return `${this.paddingAmount}px`;
  }

}
