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
  @Input()
  public isFourColumnsMax: boolean = false;
  constructor(
  ) {
  }

  ngOnInit() {
  }

  get postsLengthMultipleOf3() {
    return this.posts.length % 3 === 0;
  }

  get postsLengthMultipleOf2() {
    return this.posts.length % 2 === 0;
  }

}
