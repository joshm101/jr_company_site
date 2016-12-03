import { Component, DoCheck, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MdSidenav } from '@angular/material';

import { MdToolbar } from '@angular/material/toolbar';
import { MdIcon } from '@angular/material';

@Component({
  selector: 'interface-root',
  templateUrl: 'ts/components/interface/interface.component.html'
})
export class InterfaceRootComponent implements OnInit {
  constructor(protected elementRef: ElementRef) {

  }

  ngOnInit() {
    this.screenWidth = this.elementRef.nativeElement.ownerDocument.body.clientWidth;
  }

  onResize(event: Event) {
    this.screenWidth = this.elementRef.nativeElement.ownerDocument.body.clientWidth;
  }

  screenWidth: number;
}
