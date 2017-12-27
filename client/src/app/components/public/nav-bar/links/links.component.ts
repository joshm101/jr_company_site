import { Component, OnInit, Input } from '@angular/core';
import { ContactInfo } from '../../../interface/interface-contact-info-content/contact-info.index';

type Link = {
  label: string,
  url: string
};

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit {
  @Input() public links: Link[];
  @Input() public isOpen: boolean = false;
  @Input() public screenWidth: number;
  @Input() public contactInfo: ContactInfo;
  constructor() { }

  ngOnInit() {
  }

}
