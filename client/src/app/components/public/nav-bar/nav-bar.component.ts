import { Component, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { ScreenSizeService } from '../../../external-services/screen-size/screen-size.service';
import { ContactInfo, ContactInfoService } from '../../interface/interface-contact-info-content/contact-info.index';

type Link = {
  label: string,
  url: string
};


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  @Input() set shouldCollapseLogo(val: boolean) {
    this._shouldCollapseLogo = val;
  }

  public contactInfo$: Observable<ContactInfo>;


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
    private contactInfoService: ContactInfoService,
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
        label: 'Games',
        url: '/games',
      },
      {
        label: 'About',
        url: '/about'
      }
    ];

    this._shouldExpandLinks = new BehaviorSubject(false);
    this.shouldExpandLinks$ = this._shouldExpandLinks.asObservable();
    this.onNavBarMouseEnter = new EventEmitter<boolean>();
    this.onNavBarMouseLeave = new EventEmitter<boolean>();
    this.menuOpenStatusChange = new EventEmitter<boolean>();

    this.contactInfo$ = this.contactInfoService.getAll().map(contactInfos =>
      contactInfos[0]
    );
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
    //this.menuIsOpen = !this.menuIsOpen;
    this.menuOpenStatusChange.emit(!this.menuIsOpen);
  }

  get screenWidth() {
    return this._screenSizeService.screenWidth;
  }

  public toggleLinks() {
    this._shouldExpandLinks.next(!this._shouldExpandLinks.getValue());
  }

}
