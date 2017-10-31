import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import { AppModel } from '../../app.model';

@Injectable()
export class ContentLoadService {
  constructor() {
    this.postMapping = new Map<AppModel, number>();
    this.doneLoadingArbiter = new Subject<boolean>();
    this.doneLoadingArbiter.next(false);
    this.doneLoading$ = this.doneLoadingArbiter.asObservable();
  }

  /**
   * Initialize the service's mapping
   * of posts
   * @param posts
   */
  setPostMap(posts: AppModel[]) {
    posts.forEach(post => {
        this.postMapping.set(post, 0);
    });
    if (this.postMapping.size === 0) {
      setTimeout(() => {
        this.doneLoadingArbiter.next(true);
      }, 100)
    } else {
      this.doneLoadingArbiter.next(false);
    }
  }

  /**
   * Check if the service is currently tracking
   * any posts or not.
   * @returns {boolean}
   */
  contentBeingTracked() {
    return this.postMapping.size != 0;
  }

  /**
   * Called when a component is destroyed that
   * is managing the display of posts
   */
  removeAllTrackedContent() {
    this.postMapping.clear();
    //this.doneLoadingArbiter.next(false);
  }

  /**
   * Remove a tracked post from the service's
   * map.
   * @param post
   */
  removeContentToTrack(post: AppModel) {
    if (this.postMapping.has(post)) {
      this.postMapping.delete(post);
    }
  }

  /**
   * Function to be called by a post component
   * whenever it is done loading so that the service
   * can update accordingly.
   * @param post
   */
  contentLoadingDone(post: AppModel) {
    console.log("post: ", post);
    console.log("this.postMapping: ", this.postMapping);
    if (this.postMapping.has(post)) {
      this.postMapping.set(post, 1);
      this.determineLoadDone();
    }
  }

  /**
   * Function to set an item on map
   * as not loaded. Used when post is
   * edited
   * @param post
   */
  contentNeedsLoading(post: AppModel) {
    this.postMapping.set(post, 0);
    this.doneLoadingArbiter.next(false);
  }

  /**
   * Whenever a post emits a done loading
   * event, call this function to determine
   * if all posts are done loading or not.
   */
  private determineLoadDone() {
    let loaded = true;
    this.postMapping.forEach(val => {
      if (val === 0) {
        loaded = false;
        console.log("val is: ", val);
        this.doneLoadingArbiter.next(false);
      }
    });
    if (loaded) {
      console.log('content load done!!!');
      this.doneLoadingArbiter.next(true);
    }
  }

  /**
   * Check load status of an individual post.
   * @param post
   * @returns {boolean}
   */
  checkLoadStatus(post: AppModel) {
    return this.postMapping.has(post);
  }

  doneLoading$: Observable<boolean>;
  private doneLoadingArbiter: Subject<boolean>;
  postMapping: Map<AppModel, number>;
}
