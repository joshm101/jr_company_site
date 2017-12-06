import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-public-about-image',
  templateUrl: './public-about-image.component.html',
  styleUrls: ['./public-about-image.component.css']
})
export class PublicAboutImageComponent implements OnInit {
  @Input()
  imageSrc: string;
  constructor() { }

  ngOnInit() {
  }

}
