import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'interface-root',
  templateUrl: 'ts/components/interface/root/interface-root.component.html'
})
export class InterfaceRootComponent implements AfterViewInit {
  constructor() {
    this.tabLinks = [
      {
        label: 'Music',
        path: 'music'
      },
      {
        label: 'Field Recordings',
        path: 'field-recordings'
      }
    ];
    this.activeLinkIndex = 0;
  }

  ngAfterViewInit() {
    this.rlaSafe = true;
  }

  rlaSafe: boolean;
  activeLinkIndex: number;
  tabLinks: any[];
}

