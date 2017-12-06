import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-public-about-description',
  templateUrl: './public-about-description.component.html',
  styleUrls: ['./public-about-description.component.css']
})
export class PublicAboutDescriptionComponent implements OnInit {
  @Input()
  text: string;
  constructor() { }

  ngOnInit() {
  }

}
