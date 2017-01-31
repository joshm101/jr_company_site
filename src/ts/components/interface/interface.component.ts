import { Component, DoCheck, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs/rx';

import { EmbedPost, EmbedPostService } from '../embed-post/embed-post.index';
import { PostFormComponent } from './post-form/post-form.component';
import { JDialogComponent } from '../j-dialog/j-dialog.component';
import { PostFormDialogComponent } from './post-form/post-form-dialog/post-form-dialog.component';

@Component({
  selector: 'interface-root',
  templateUrl: 'ts/components/interface/interface.component.html'
})
export class InterfaceRootComponent implements OnInit {
  constructor(
    protected elementRef: ElementRef,
    protected embedPostService: EmbedPostService,
    protected sanitizer: DomSanitizer,
    public dialog: MdDialog
  ) {
    this.isLoading = true;
    this.embedPostService.getAll().filter(Boolean).subscribe(
      (posts) => {
        // once we have our posts,
        // we begin the process of
        // loading all of the thumbnail
        // images, so show loading spinner
        this.isLoading = true;
        this.embedPosts = posts;
        this.numPosts = posts.length;

        // no posts to load,
        // don't show spinner
        if (this.numPosts === 0) {
          this.isLoading = false;
        }
      }
    );
  }

  dialogRef: MdDialogRef<PostFormDialogComponent>;

  removePost(id: string) {
    this.embedPostService.delete(id).subscribe(
      () => {

        // One less post loaded
        // as one has been deleted.
        this.numPostsLoaded--;
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  editPost(post: EmbedPost) {

    this.dialogRef = this.dialog.open(PostFormDialogComponent, {
      width: "65%",
      disableClose: true,
    });
    this.dialogRef.componentInstance.newEmbedPost = post;
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;
    });
  }

  focusEvent(event: boolean) {
    this.focusForm = event;
  }

  formDone() {
    this.focusForm = false;
  }

  handleSubmission() {
    this.numPosts++;
    // get current height of screen
    this.screenHeight = this.elementRef.nativeElement.ownerDocument.body.clientHeight;
    this.isLoading = true;
  }

  submissionFinished() {
    console.log("submission finished");
    //this.isLoading = false;
  }

  submissionFinishedWithError() {
    this.isLoading = false;
    alert("There was an error while processing the request. Please refresh and try again.")
  }

  postTrackBy(index: number, item: EmbedPost) {
    return item._id;
  }

  postDoneLoading() {
    this.numPostsLoaded++;
    if (this.numPostsLoaded === this.numPosts) {
      this.isLoading = false;
    }
  }

  ngOnInit() {
    this.calculateColumns();
  }

  // hook into the resize event and check the width of the page/document,
  // setting the number of columns in our grid list as appropriate
  onResize(event: Event) {
    this.calculateColumns();
  }

  calculateColumns() {
    // get current width of screen
    this.screenWidth = this.elementRef.nativeElement.ownerDocument.body.clientWidth;

    // set the number of columns
    // for our grid list depending on the
    // current width.
    if (this.screenWidth >= 1500) {
      this.cols = 4;
      return;
    }
    if (this.screenWidth >= 1250) {
      this.cols = 3;
      return;
    }
    if (this.screenWidth >= 1008) {
      this.cols = 2;
      return;
    }
    if (this.screenWidth < 760) {
      this.cols = 1;
      return;
    }
    this.cols = 2;
  }

  focusForm: boolean = false;
  embedPosts$: Observable<EmbedPost[]>;
  embedPosts: EmbedPost[];
  subscriptions: Subscription[];
  screenWidth: number;
  screenHeight: number;
  cols: number;
  isLoading: boolean;
  numPosts: number;
  numPostsLoaded: number = 0;
}
