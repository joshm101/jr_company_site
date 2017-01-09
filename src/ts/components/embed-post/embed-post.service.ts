import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/rx';

import { EmbedPost } from './embed-post.model';
import { AppService } from '../app.service';

@Injectable()
export class EmbedPostService extends AppService<EmbedPost> {
  constructor(http: Http, protected sanitizer: DomSanitizer) {
    super(http);
  }

  getAll(): Observable<EmbedPost[]> {
    return super.getAll().map((posts: EmbedPost[]) => {
      posts.forEach(post => {
        post.embedContentSafe = [];
      });
      posts.forEach(post => this.createSafeHtml(post));
      return posts;
    })
  }

  create(post: EmbedPost): Observable<EmbedPost[]> {

    // our service super class handles almost all of the
    // creation logic, but EmbedPosts in particular have
    // the field embedContent which is an array of iframes.
    // These iframes need to be marked safe by Angular.
    return super.create(post).map((posts: EmbedPost[]) => {
      let i = posts.length - 1;
      let post: EmbedPost = posts[i];

      // Mark all of the iframes as safe html
      this.createSafeHtml(post);
      return posts;
    });
  }

  // Marks each embedded item
  // of a post as trusted so Angular
  // will render the iframe in the
  // view
  createSafeHtml(post: EmbedPost) {
    post.embedContentSafe = [];
    post.embedContent.forEach(iframe =>
      post.embedContentSafe.push(this.sanitizer.bypassSecurityTrustHtml(iframe))
    );
  }

  protected getResource(): string {
    return 'embedPosts';
  }
}
