import { Component, OnInit, Input } from '@angular/core';

import { EmbedPost } from '../../../embed-post/embed-post.index';

@Component({
  selector: 'app-public-latest-posts-post',
  templateUrl: './public-latest-posts-post.component.html',
  styleUrls: ['./public-latest-posts-post.component.css']
})
export class PublicLatestPostsPostComponent implements OnInit {
  @Input() public post: EmbedPost;

  constructor() { }

  ngOnInit() {
  }

}
