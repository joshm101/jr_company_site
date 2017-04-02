import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs/rx';

import { EmbedPost } from '../embed-post/embed-post.model';
import { EmbedPostService } from '../embed-post/embed-post.service';


@Component({
  selector: 'index-root',
  templateUrl: 'index.component.html'
})
export class IndexRootComponent implements OnDestroy {
  constructor(
    protected embedPostService: EmbedPostService,
    protected sanitizer: DomSanitizer
  ) {
    this.subscriptions = [];
    this.isLoading = true;
    /*
    this.subscriptions.push(
      this.embedPostService.getAll().filter(Boolean).take(1).subscribe(
        posts => {
          console.log(posts);
          posts.forEach(post => { post.embedContentSafe = []; });
          posts.forEach(post => post.embedContent.forEach(iframe =>
            post.embedContentSafe.push(this.sanitizer.bypassSecurityTrustHtml(iframe))
          ));
          this.embedPosts$ = Observable.of(posts);
          this.isLoading = false;
        },
        error => {
          console.log(error);
        }
      )
    ); */
  }

  isLoading: boolean;
  subscriptions: Subscription[];
  embedPosts$: Observable<EmbedPost[]>;

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
