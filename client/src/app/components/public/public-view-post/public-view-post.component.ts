import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';

import { EmbedPost, EmbedPostService } from '../../embed-post/embed-post.index';

@Component({
  selector: 'app-public-view-post',
  templateUrl: './public-view-post.component.html',
  styleUrls: ['./public-view-post.component.css']
})
export class PublicViewPostComponent implements OnInit, OnDestroy {
  public post: EmbedPost;
  public embedContent: SafeHtml;
  public subscriptions: Subscription[];
  constructor(
    private route: ActivatedRoute,
    private embedPostService: EmbedPostService,
    private domSanitizer: DomSanitizer
  ) { 
    this.subscriptions = [];
    this.subscriptions.push(
      this.route.queryParams.filter(
        queryParams => !!queryParams
      ).switchMap(queryParams => {
        const { id } = queryParams;      
        if (id) {
          return this.embedPostService.get(id).filter((post) => { 
            return !!post;
          });
        }
        return Observable.of(undefined);
      }).subscribe(
        (post) => {
          this.post = post;
          this.embedContent = this.getSafeEmbedContent();
        }
      )
    );


  }

  ngOnInit() {
  }

  /**
   * Returns true if embedContent array is empty. False otherwise
   * @return {boolean} value of embedContentNotEmpty test
   */
  get embedContentNotEmpty() {
    return this.post && this.post.embedContent && this.post.embedContent.length > 0;
  }

  /**
   * Returns array of SafeHtml iframe code to embed into view.
   * @return {SafeHtml[]}
   */
  getSafeEmbedContent() {
    if (this.embedContentNotEmpty) {
      // there is embedContent to display

      // return sanitized array of embeddable content html for view
      return this.post.embedContent.map(iframeHtml =>
        this.domSanitizer.bypassSecurityTrustHtml(iframeHtml)
      );
    }

    // no embed content for current post, return empty array.
    return [];
  }  

  ngOnDestroy() {
    this.subscriptions.forEach(subscription =>
      subscription.unsubscribe()
    );
  }

}
