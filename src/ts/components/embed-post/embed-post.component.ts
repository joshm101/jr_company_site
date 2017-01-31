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
  @Input() post: EmbedPost;
  @Output() doneLoading: EventEmitter<boolean>;

}
