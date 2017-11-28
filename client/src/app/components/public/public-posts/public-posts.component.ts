import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { EmbedPost } from '../../embed-post/embed-post.index';


@Component({
  selector: 'app-public-posts',
  templateUrl: './public-posts.component.html',
  styleUrls: ['./public-posts.component.css']
})
export class PublicPostsComponent implements OnInit {
  @Input()
  public posts: EmbedPost[];
  @Input()
  public shouldLoadPosts: boolean;
  constructor(
  ) {
  }

  ngOnInit() {
  }

}
