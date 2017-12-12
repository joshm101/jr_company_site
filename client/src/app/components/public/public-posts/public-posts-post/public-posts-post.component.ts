import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  handleImageLoadDoneEvent() {
    this.imageLoaded = true;
  }

  triggerPostLoad() {
    this.shouldLoad = true;
  }

  navigateToPost() {
    this.router.navigate(
      ['/view'],
      {
        queryParams: { id: this.post._id }
      }
    );  
  }
}
