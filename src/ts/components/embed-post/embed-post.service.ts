import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/rx';

import { EmbedPost } from './embed-post.model';
import { AppService } from '../app.service';
import { FileUploader } from 'ng2-file-upload';

@Injectable()
export class EmbedPostService extends AppService<EmbedPost> {

  public uploader: FileUploader;
  constructor(protected http: Http, protected sanitizer: DomSanitizer) {
    super(http);
    this.uploader = new FileUploader({
      url: "http://localhost:3000/api/upload"
    });
  }

  public new(data?: any) {
    return new EmbedPost(data);
  }

  getAll(): Observable<EmbedPost[]> {
    return super.getAll().distinctUntilChanged().map((posts: EmbedPost[]) => {
      posts.forEach((post) => {
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
    return super.create(post).switchMap((posts: EmbedPost[]) => {
      let i = posts.length - 1;
      let post: EmbedPost = posts[i];

      // Mark all of the iframes as safe html
      this.createSafeHtml(post);

      // create form to upload images associated with
      // posts (if any were selected).
      // Uploading happens after the post is created
      // and saved to the DB so that we at least have
      // a reference to the post in case the uploading
      // fails.
      if (this.uploader.queue.length > 0) {
        let formData = new FormData();
        formData.append('imagesid', this.newlyCreatedItem.imagesId);
        this.uploader.queue.forEach(queueItem => formData.append('fileUpload', queueItem._file));
        console.log(this.uploader.queue);

        return this.http.post('/api/upload', formData)
          .map(res => res.json())
          .map((returnedPost: EmbedPost): EmbedPost[] => {
            posts.forEach(post => {
              if (post.imagesId === returnedPost.imagesId) {
                // update the recently created post's images
                // array to contain the paths of images uploaded
                // for the post.
                post.images = returnedPost.images;
              }
            });
            return posts;
          });
      } else {
        // no images uploaded.
        return Observable.of(posts);
      }
    });
  }

  getUploaderInstance() {
    return this.uploader;
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
