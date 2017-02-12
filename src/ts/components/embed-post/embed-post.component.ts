import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs/rx';

import { EmbedPost } from './embed-post.model';
import { EmbedPostService } from './embed-post.service';


@Component({
  selector: 'embed-post',
  templateUrl: 'ts/components/embed-post/embed-post.component.html'
})
export class EmbedPostComponent implements OnInit {
  constructor(
    protected embedPostService: EmbedPostService
  ) {
    this.doneLoading = new EventEmitter<boolean>();

  }

  ngOnInit() {
    // no images to render and an upload is not currently
    // in progress.
    // In the case of an upload being in progress,
    // then this post will have an image to load
    // when the upload request has finished, so
    // not done loading until upload is finished and
    // thumbnail is rendered.
    if (this.post.images.length === 0 && !this.embedPostService.uploadRequestInFlight) this.doneLoading.emit(true);
  }

  finishedLoadingPost() {
    this.doneLoading.emit(true);
  }

  handlePostLoadError() {

    // Current application will receive a response with a post
    // and then upload images. The loading spinner will be displayed,
    // but the post will be rendered "behind" the spinner (out of sight)
    // without a thumbnail to render (because images are uploading,
    // including thumbnail). This throws a 404 on a null image
    // path. SO, if an upload is happening, we will not emit
    // done loading on error because of pending upload to finish.
    // Once image uploading is done, the <img> src tag
    // will be updated, causing a GET for the image request,
    // and subsequent finishedLoadingPost() call on
    // successful load (to then properly emit doneLoading event).
    // If, in fact, there is no pending upload and we have a 404
    // on an <img> src, then we will mark as done loading
    // so spinner can properly go away.
    if (!this.embedPostService.uploadRequestInFlight) {
      this.doneLoading.emit(true);
    }
  }
  @Input() post: EmbedPost;
  @Output() doneLoading: EventEmitter<boolean>;

}
