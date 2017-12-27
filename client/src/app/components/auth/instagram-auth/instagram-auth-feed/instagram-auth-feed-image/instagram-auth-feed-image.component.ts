import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-instagram-auth-feed-image',
  templateUrl: './instagram-auth-feed-image.component.html',
  styleUrls: ['./instagram-auth-feed-image.component.css']
})
export class InstagramAuthFeedImageComponent implements OnInit {
  @Input()
  public src: string;
  constructor() { }

  ngOnInit() {
  }

}
