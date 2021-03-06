import { 
  Component, 
  DoCheck, 
  OnInit, 
  OnDestroy, 
  ViewChild, 
  ElementRef, 
  HostListener, 
  trigger, 
  transition, 
  style, 
  state, 
  animate, 
  AfterViewInit, 
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, BehaviorSubject, Subscription } from 'rxjs/Rx';

import { EmbedPost, EmbedPostService } from '../../embed-post/embed-post.index';
import { InterfacePostFormComponent } from '../interface-post-form/interface-post-form.component';
import { InterfacePostFormDialogComponent } from '../interface-post-form/interface-post-form-dialog/interface-post-form-dialog.component';
import { InterfacePostDeleteConfirmDialogComponent } from '../interface-post-delete-confirm-dialog/interface-post-delete-confirm-dialog.component';
import { InterfaceViewPostComponent } from '../interface-view-post/interface-view-post.component';
import { ContentLoadService } from '../../../external-services/content-load/content-load.service';
import { 
  UserPreferences,
  UserPreferencesService,
} from '../../../external-services/user-preferences/user-preferences.index';

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
      public dialog: MatDialog,
      private route: ActivatedRoute,
      private contentLoadService: ContentLoadService,
      private snackBar: MatSnackBar,
      private changeDetectorRef: ChangeDetectorRef,
      private userPreferencesService: UserPreferencesService
    ) {
      this.isLoading = true;
      this.animationState = "inactive";
      this.doneLoadingContent = false;
      this.itemsPerPageArbiter = new BehaviorSubject<number>(4);
      this.itemsPerPage$ = this.itemsPerPageArbiter.asObservable();
      this.subscriptions = [];
      this.subscriptions.push(
        this.route.paramMap.subscribe(
          (params) => {
            this.contentType = parseInt(params.get('contentType'));
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
            if (this.doneLoadingContent) {
              this.animationState = 'active';
            }
          }
        ),
        this.embedPostService.rawGetAllResponse$.subscribe(
          (res) => {
            if (res) {
              this.setHasNextPage(res['hasNextPage']);
              this.hasPreviousPage = res.hasPreviousPage;
            }
          }
        ),
        Observable.combineLatest(
          this.userPreferencesService.getUserPreferences(),
          this.route.paramMap
        ).switchMap(([userPreferences, params]) =>{
          this.embedPostService.itemsPerPage = userPreferences.itemsPerPage;
          this.userPreferences = userPreferences;          
          this.currentContentType = parseInt(params.get('contentType'));
          return this.embedPostService.getAll({
            params: [
              { 
                key: 'content_type', 
                value: parseInt(params.get('contentType')) 
              }
            ]
          });
        }).subscribe(
          (posts) => {
            if (posts.length === 0 && this.embedPostService.currentPage > 1) {
              this.embedPostService.setPage(1);
            } 
            if (this.changingPages) {
              this.contentLoadService.removeAllTrackedContent();
              this.contentLoadService.setPostMap(posts);              
            }
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
            this.changingPages = false;            
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
    dialogRef: MatDialogRef<InterfacePostFormDialogComponent>;
    dialogRefDelete: MatDialogRef<InterfacePostDeleteConfirmDialogComponent>;
    dialogRefViewPost: MatDialogRef<InterfaceViewPostComponent>;

    ngOnInit() {
      this.calculateColumns();
    }

    removePost(post: EmbedPost) {
      this.embedPostService.delete(
        post._id
      ).switchMap((_) => 
        // retrieve new data for current page
        // since a post has been removed.
        this.embedPostService.getAll(
          {
            params: [
              { 
                key: 'content_type', 
                value: this.currentContentType, 
              }
            ]
          }
        )
      ).take(
        1
      ).subscribe(
        () => {

          // One less post loaded
          // as one has been deleted.
          this.numPostsLoaded--;
          this.isLoading = false;
          this.animationState = "active";
          this.contentLoadService.removeContentToTrack(post);
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

    showDeleteConfirmDialog(post: EmbedPost) {
      this.dialogRefDelete = this.dialog.open(InterfacePostDeleteConfirmDialogComponent, {
        width: this.screenWidth < 760 ? "95%" : "65%",
        disableClose: true,
      });
      this.dialogRefDelete.afterClosed().take(1).subscribe(result => {
        if (result) { 
          this.removePost(post);
        }
      })
    }

    focusEvent(event: boolean) {
      this.focusForm = event;
      this.changeDetectorRef.detectChanges();
    }

    viewPost(post: EmbedPost) {
      this.dialogRefViewPost = this.dialog.open(InterfaceViewPostComponent, {
        width: this.screenWidth < 760 ? "95%" : "65%",
        data: {post}
      });
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
    }

    submissionFinishedWithError() {
      this.isLoading = false;
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
      if (
        !this.embedPostService.requestInFlight && 
        !this.embedPostService.uploadRequestInFlight &&
        !this.userPreferencesService.requestInFlight &&
        this.doneLoadingContent
      ) {
        this.animationState = 'active';
      }
      return (
        this.embedPostService.requestInFlight || 
        this.embedPostService.uploadRequestInFlight ||
        this.userPreferencesService.requestInFlight
      );
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

    handleNextPageClick() {
      this.changingPages = true;
      this.embedPostService.incrementPage();
    }

    handlePreviousPageClick() {
      this.changingPages = true;
      this.embedPostService.decrementPage();
    }

    handleItemsPerPageChange(value: number) {
      this.userPreferences.itemsPerPage = value;
      this.userPreferencesService.updateUserPreferences(
        this.userPreferences
      ).take(1).subscribe(
        (preferences) => {
          this.itemsPerPageArbiter.next(preferences.itemsPerPage)
          this.snackBar.open(
            'Items per page successfully saved.',
            '',
            {
              duration: 3000
            }
          );
        },
        (error) => {
          console.error(error);
        }
      )
    }

    get itemsPerPage() {
      if (this.userPreferences) {
        return this.userPreferences.itemsPerPage || 4;
      }
      return 4;
    }

    setHasNextPage(value: boolean) {
      this.hasNextPage = value;
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
    changingPages: boolean;
    currentContentType: number;
    itemsPerPageArbiter: BehaviorSubject<number>;
    itemsPerPage$: Observable<number>;
    userPreferences: UserPreferences;
    hasNextPage: boolean;
    hasPreviousPage: boolean;

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
