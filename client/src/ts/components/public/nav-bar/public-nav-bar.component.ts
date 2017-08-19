import { Component, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

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
  @Input() set shouldCollapseLogo(val: boolean) {
    this._shouldCollapseLogo = val;
  }
  

  get shouldCollapseLogo() {
    return this._shouldCollapseLogo;
  }

  @Input() set linksOpacity(val: number) {
    this._linksOpacity = val;
  }

  @Output() onNavBarMouseEnter: EventEmitter<boolean>;
  @Output() onNavBarMouseLeave: EventEmitter<boolean>;
  @Output() menuOpenStatusChange: EventEmitter<boolean>;

  @Input() public menuIsOpen: boolean = false;

  get linksOpacity() {
    return this._linksOpacity;
  }

  get shouldHideLinks() {
    return this.shouldCollapseLogo || this.linksOpacity === 0;
  }

  public links: Link[];
  private _shouldCollapseLogo: boolean;
  private _linksOpacity: number;

  private _shouldExpandLinks: BehaviorSubject<boolean>;
  public shouldExpandLinks$: Observable<boolean>;
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
        label: 'Video',
        url: '/video',
      },
      {
        label: 'Bio',
        url: '/about',
      },
      {
        label: 'Contact',
        url: '/contact'
      }
    ];

    this._shouldExpandLinks = new BehaviorSubject(false);
    this.shouldExpandLinks$ = this._shouldExpandLinks.asObservable();
    this.onNavBarMouseEnter = new EventEmitter<boolean>();
    this.onNavBarMouseLeave = new EventEmitter<boolean>();
    this.menuOpenStatusChange = new EventEmitter<boolean>();
  }

  @HostListener('mouseenter')
  public _handleMouseEnter() {
    this.onNavBarMouseEnter.emit(true);
  }

  @HostListener('mouseleave')
  public _handleMouseLeave() {
    this.onNavBarMouseLeave.emit(true);
  }

  public handleNavMenuToggle() {
    console.log('nav menu toggle');
    this.menuIsOpen = !this.menuIsOpen;
    this.menuOpenStatusChange.emit(this.menuIsOpen);
  }

  get screenWidth() {
    return this._screenSizeService.screenWidth;
  }

  public toggleLinks() {
    this._shouldExpandLinks.next(!this._shouldExpandLinks.getValue());
  }
}