import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ContentTypeEnum } from '../../../enums/content-type.enum';

@Component({
  selector: 'interface-root',
  templateUrl: 'ts/components/interface/root/interface-root.component.html'
})
export class InterfaceRootComponent implements AfterViewInit {
  constructor(

  ) {

    // get initial tab index from contentType
    // based on contentType parameter, if exists
    this.activeLinkIndex = parseInt(window.location.href[window.location.href.length - 1]);
    this.tabLinks = [
      {
        label: 'Music',
        path: 'music',
        contentType: ContentTypeEnum.Music
      },
      {
        label: 'Field Rec.',
        path: 'field-recordings',
        contentType: ContentTypeEnum.FieldRecordings
      },
      {
        label: 'Film',
        path: 'film',
        contentType: ContentTypeEnum.Film
      },
      {
        label: 'Other',
        path: 'other',
        contentType: ContentTypeEnum.Eng
      },
      {
        label: 'About',
        path: 'about',
        contentType: ContentTypeEnum.About
      }
    ];
  }

  ngAfterViewInit() {
    this.rlaSafe = true;
  }

  rlaSafe: boolean;
  activeLinkIndex: number;
  tabLinks: any[];

  ContentTypeEnum = ContentTypeEnum;
}

