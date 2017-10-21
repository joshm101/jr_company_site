import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { EmbedPost } from '../../embed-post/embed-post.index';
import { LatestContentService } from '../../../external-services/latest-content/latest-content.service';

@Component({
  selector: 'app-public-latest-posts',
  templateUrl: './public-latest-posts.component.html',
  styleUrls: ['./public-latest-posts.component.css']
})
export class PublicLatestPostsComponent implements OnInit {
  public latestPosts$: Observable<EmbedPost[]>;
  constructor(
    private latestContentService: LatestContentService,
  ) {
    this.latestPosts$ = this.latestContentService.getLatestPosts();
  }

  ngOnInit() {
  }

}
