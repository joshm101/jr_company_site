import { Component, OnInit, Input } from '@angular/core';

import { EmbedPost } from '../../../embed-post/embed-post.index';

@Component({
  selector: 'app-public-posts-post',
  templateUrl: './public-posts-post.component.html',
  styleUrls: ['./public-posts-post.component.css']
})
export class PublicPostsPostComponent implements OnInit {
  @Input() 
  public post: EmbedPost;
  @Input()
  public shouldLoad: boolean;
  public imageLoaded: boolean;

  constructor() { }

  ngOnInit() {
  }

  handleImageLoadDoneEvent() {
    this.imageLoaded = true;
  }
}
