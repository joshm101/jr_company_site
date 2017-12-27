import { Component, Input, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-public-view-post-embed-content',
  templateUrl: './public-view-post-embed-content.component.html',
  styleUrls: ['./public-view-post-embed-content.component.css']
})
export class PublicViewPostEmbedContentComponent implements OnInit {
  @Input()
  public embedContent: SafeHtml[];
  constructor() { }

  ngOnInit() {
  }

}
