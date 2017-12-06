import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import {
  About, AboutService 
} from '../../interface/interface-about-content/about.index';
import { 
  ContactInfo, ContactInfoService 
} from '../../interface/interface-contact-info-content/contact-info.index';

@Component({
  selector: 'app-public-about',
  templateUrl: './public-about.component.html',
  styleUrls: ['./public-about.component.css']
})
export class PublicAboutComponent implements OnInit {
  public about$: Observable<About>;
  public contactInfo$: Observable<ContactInfo>;
  constructor(
    private aboutService: AboutService,
    private contactInfoService: ContactInfoService
  ) {
    this.about$ = this.aboutService.getAll().map(abouts =>
      abouts[0]
    );
    this.contactInfo$ = this.contactInfoService.getAll().map(contactInfos =>
      contactInfos[0]
    );
  }

  ngOnInit() {
  }

}
