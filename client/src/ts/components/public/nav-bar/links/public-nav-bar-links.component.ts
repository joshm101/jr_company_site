import { Component, Input } from '@angular/core';

type Link = {
  label: string,
  url: string
};

@Component({
  selector: 'public-nav-bar-links',
  templateUrl: 'public-nav-bar-links.component.html'
})
export class PublicNavBarLinksComponent {
  @Input() public links: Link[];

  constructor(

  ) {
    
  }
}