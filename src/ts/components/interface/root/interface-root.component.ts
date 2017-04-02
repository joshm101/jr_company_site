import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { ContentTypeEnum } from '../../../enums/content-type.enum';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'interface-root',
  templateUrl: 'interface-root.component.html'
})
export class InterfaceRootComponent implements AfterViewInit {
  constructor(
    private _authService: AuthService,
    private _router: Router,
  ) {

    // get initial tab index from contentType
    // based on contentType parameter, if exists
    this.activeLinkIndex = parseInt(window.location.href[window.location.href.length - 1]) || 0;
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

  logout() {
    this._authService.logout().take(1).subscribe(
      (success) => {
        this._router.navigate(['/']);
      },
      (error) => {
        console.error(error);
      }
    )
  }

  rlaSafe: boolean;
  activeLinkIndex: number;
  tabLinks: any[];

  ContentTypeEnum = ContentTypeEnum;
}

