import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentTypeEnum } from '../../../enums/content-type.enum';

@Component({
  selector: 'interface-root',
  templateUrl: 'ts/components/interface/root/interface-root.component.html'
})
export class InterfaceRootComponent implements AfterViewInit {
  constructor() {
    this.tabLinks = [
      {
        label: 'Music',
        path: 'music',
        contentType: ContentTypeEnum.Music
      },
      {
        label: 'Field Recordings',
        path: 'field-recordings',
        contentType: ContentTypeEnum.FieldRecordings
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

  ContentTypeEnum = ContentTypeEnum;
}

