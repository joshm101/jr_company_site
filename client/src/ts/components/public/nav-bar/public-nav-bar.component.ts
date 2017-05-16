import { Component } from '@angular/core';

import { ScreenSizeService } from '../../../external_services/screen-size/screen-size.service';

type Link = {
  label: string,
  url: string
};

@Component({
  selector: 'public-nav-bar',
  templateUrl: 'public-nav-bar.component.html'
})
export class PublicNavBarComponent {
  public links: Link[];
  constructor(
    private _screenSizeService: ScreenSizeService,
  ) {
    this.links = [
      {
        label: 'Home',
        url: '/',
      },
      {
        label: 'Audio',
        url: '/audio',
      },
      {
        label: 'Bio',
        url: '/about',
      },
      {
        label: 'Video',
        url: '/video',
      },
      {
        label: 'Contact',
        url: '/contact'
      }
    ];
  }

  get screenWidth() {
    return this._screenSizeService.screenWidth;
  }
}