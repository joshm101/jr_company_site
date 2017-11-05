import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { EmbedPost, EmbedPostService } from '../../embed-post/embed-post.index';

@Component({
  selector: 'app-public-view-post',
  templateUrl: './public-view-post.component.html',
  styleUrls: ['./public-view-post.component.css']
})
export class PublicViewPostComponent implements OnInit {
  public post$: Observable<EmbedPost>;
  constructor(
    private route: ActivatedRoute,
    private embedPostService: EmbedPostService
  ) { 
    this.post$ = this.route.queryParams.filter(
      queryParams => !!queryParams
    ).switchMap(queryParams => {
      const { id } = queryParams;      
      if (id) {
        return this.embedPostService.get(id).filter((post) => { 
          console.log("post: ", post);
          return !!post;
        });
      }
      return Observable.of(undefined);
    });
  }

  ngOnInit() {
  }

}
