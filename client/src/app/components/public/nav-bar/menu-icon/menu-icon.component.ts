import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-icon',
  templateUrl: './menu-icon.component.html',
  styleUrls: ['./menu-icon.component.css']
})
export class MenuIconComponent implements OnInit {
  @Input() public isOpen: boolean = false;
  constructor() {
      this.isOpen = false;
  }
  ngOnInit() {
  }

}
