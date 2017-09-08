import { Component, DoCheck, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, trigger, transition, style, state, animate, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs/Rx';

import { EmbedPost, EmbedPostService } from '../../embed-post/embed-post.index';
import { InterfacePostFormComponent } from '../interface-post-form/interface-post-form.component';
import { InterfacePostFormDialogComponent } from '../interface-post-form/interface-post-form-dialog/interface-post-form-dialog.component';
import { InterfacePostDeleteConfirmDialogComponent } from '../interface-post-delete-confirm-dialog/interface-post-delete-confirm-dialog.component';
import { ContentLoadService } from '../../../external-services/content-load/content-load.service';

@Component({
  selector: 'app-interface-post-content',
  animations: [
    trigger(
      'interfaceState', [
        state('inactive', style({opacity: 0})),
        state('active', style({opacity: 1})),
        transition('inactive => active', animate('300ms ease-in')),
        transition('active => inactive', animate('300ms ease-out'))
      ]
    )
  ],
  templateUrl: './interface-post-content.component.html',
  styleUrls: ['./interface-post-content.component.css']
})
export class InterfacePostContentComponent implements OnInit, OnDestroy {

  constructor(
      protected elementRef: ElementRef,
      protected embedPostService: EmbedPostService,
      protected sanitizer: DomSanitizer,
      public dialog: MdDialog,
      private route: ActivatedRoute,
      private contentLoadService: ContentLoadService,
      private snackBar: MdSnackBar
    ) {
      this.isLoading = true;
      this.animationState = "inactive";
      this.doneLoadingContent = false;
      this.subscriptions = [];
      this.subscriptions.push(
        this.route.params.filter(Boolean).subscribe(
          (params) => {
            this.contentType = parseInt(params['contentType']);
            this.embedPostService.contentType = parseInt(params['contentType']);
          }
        ),

        this.embedPostService.editErrorOccurred$.subscribe(
          (result) => {
            if (result === true) {
              this.doneLoadingContent = true;
            }
          }
        ),

        this.contentLoadService.doneLoading$.subscribe(
          (result) => {
            this.doneLoadingContent = result;
            console.log("this.doneLoadingContent: ", this.doneLoadingContent);
            if (this.doneLoadingContent) {
              this.animationState = 'active';
            }
          }
        ),

        /* Posts displayed depend on route params */
        Observable.combineLatest(
          this.route.params,
          this.embedPostService.getAll()
        ).filter(([params, posts]) =>
            params !== undefined && posts !== undefined
        ).subscribe(
          ([params, posts]) => {

            // check if the service has not yet
            // had posts set (first getAll()) and
            // set if posts haven't been set.
            if (!this.contentLoadService.contentBeingTracked()) {
              this.contentLoadService.setPostMap(posts);
            }
            // once we have our posts,
            // we begin the process of
            // loading all of the thumbnail
            // images, so show loading spinner
            this.isLoading = true;
            this.embedPosts = posts;
            this.numPosts = posts.length;
          },
          (err) => {
            console.error(err);
            this.doneLoadingContent = true;
            this.animationState = 'active';
          }
        )
      );
    }
    dialogRef: MdDialogRef<InterfacePostFormDialogComponent>;
    dialogRefDelete: MdDialogRef<InterfacePostDeleteConfirmDialogComponent>;

    ngOnInit() {
      this.calculateColumns();
    }

    removePost(id: string) {
      this.embedPostService.delete(id).subscribe(
        () => {

          // One less post loaded
          // as one has been deleted.
          this.numPostsLoaded--;
          this.isLoading = false;
          this.animationState = "active";
          this.snackBar.open("The post was successfully deleted.", "Dismiss", { duration: 5000 });          
        },
        (error) => {
          console.error(error);
          this.isLoading = false;
          this.animationState = "active";
        }
      );
    }

    editPost(post: EmbedPost) {

      this.dialogRef = this.dialog.open(InterfacePostFormDialogComponent, {
        width: this.screenWidth < 760 ? "95%" : "65%",
        disableClose: true,
      });
      this.dialogRef.componentInstance.postToEdit = post;
      this.dialogRef.afterClosed().take(1).subscribe(result => {
        this.dialogRef = null;

        // We don't want to hide content when cancel button
        // in edit form was clicked
        if (this.embedPostService.requestInFlight) {
          this.animationState = "inactive";
        } else {
          this.doneLoadingContent = true;
        }
      });
    }

    showDeleteConfirmDialog(postId: string) {
      this.dialogRefDelete = this.dialog.open(InterfacePostDeleteConfirmDialogComponent, {
        width: this.screenWidth < 760 ? "95%" : "65%",
        disableClose: true,
      });
      this.dialogRefDelete.afterClosed().take(1).subscribe(result => {
        if (result) { 
          this.removePost(postId);
        }
      })
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
      this.animationState = "inactive";
    }

    submissionFinished() {
      //this.isLoading = false;
      console.log("successful submission");
    }

    submissionFinishedWithError() {
      this.isLoading = false;
      console.log("submissionfinishedwitherror()");
      this.animationState = "active";
      this.snackBar.open("Error. Check your connection & try again.", "", { duration: 5000 });
    }

    postTrackBy(index: number, item: EmbedPost) {
      return item._id;
    }

    // hook into the resize event and check the width of the page/document,
    // setting the number of columns in our grid list as appropriate
    onResize(event: Event) {
      this.calculateColumns();
    }

    get requestInFlight() {
      return this.embedPostService.requestInFlight;
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
    animationState: string;
    contentType: number;
    doneLoadingContent$: Observable<boolean>;
    doneLoadingContent: boolean;
    applyToolbarShadow: boolean;

    /**
     * Ensures that service is 'reset' to
     * a fresh state. ngOnDestroy would
     * occur when navigating away
     * from the current route, so we
     * don't want leftover items
     * in our new route.
     */
    ngOnDestroy() {
      this.contentLoadService.removeAllTrackedContent();
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

}
