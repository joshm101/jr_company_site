import { Component, Input, OnInit } from '@angular/core';
import { ContactInfo } from '../../../interface/interface-contact-info-content/contact-info.index';

@Component({
  selector: 'app-public-about-links',
  templateUrl: './public-about-links.component.html',
  styleUrls: ['./public-about-links.component.css']
})
export class PublicAboutLinksComponent implements OnInit {
  @Input()
  public contactInfo: ContactInfo;
  
  constructor() { }

  ngOnInit() {
  }

}
