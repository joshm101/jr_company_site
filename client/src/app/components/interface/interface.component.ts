import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { ContentTypeEnum } from '../../enums/content-type.enum';
import { AuthService } from '../auth/auth.service';
import { ScreenSizeService } from '../../external-services/screen-size/screen-size.service';

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements AfterViewInit {
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _screenSizeService: ScreenSizeService,
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
      },
      {
        label: 'Contact Info',
        path: 'contact-info',
        contentType: ContentTypeEnum.ContactInfo
      }
    ];
    this.currentWidth = this._screenSizeService.screenWidth;
  }

  ngAfterViewInit() {
    this.rlaSafe = true;
  }

    @HostListener('window:scroll', ['$event'])
  onWindowScrollEvent(event: Event) {
    console.log("scroll event: ", event);
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

  onResize(event: Event) {
    this.currentWidth = this._screenSizeService.screenWidth;
  }

  goToSettings() {
    console.log("trigger settings");
    this._router.navigate(['/settings']);
  }

  rlaSafe: boolean = false;
  activeLinkIndex: number;
  tabLinks: any[];
  currentWidth: number;

  ContentTypeEnum = ContentTypeEnum;
}
