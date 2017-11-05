import { Component, OnInit, Input, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA } from '@angular/material';

import { EmbedPost } from '../../embed-post/embed-post.index';


@Component({
  selector: 'app-interface-view-post',
  templateUrl: './interface-view-post.component.html',
  styleUrls: ['./interface-view-post.component.css']
})
export class InterfaceViewPostComponent implements OnInit {
  post: EmbedPost;
  constructor(
    private domSanitizer: DomSanitizer,
    // post data supplied by component which triggers
    // this dialog component
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 

  }

  ngOnInit() {
    this.post = this.data.post;
  }

  /**
   * Event handler for Done button click. Angular
   * handles dialog closing logic, but we want to 
   * prevent any potential (& unwanted) default click behavior
   * @param event done button click event
   */
  doneViewingPost(event: Event) {
    // prevent default behavior
    event.preventDefault();
  }  

  /**
   * Gets the current post's thumbnail image URL string.
   * @return {string} URL string of thumbnail image
   */
  get thumbnailImage() {
    if (this.post && this.post.images && this.post.images[this.post.thumbnailIndex]) {
      // if post exists and images array is defined and the image given by the thumbnail index
      // into the array of image URLs is defined, return that image's URL string 
      return this.post.images[this.post.thumbnailIndex];
    }
    
    // return an empty string if the thumbnail image is not defined
    return '';
  }

  /**
   * @return {string[]} array of non thumbnail image URL strings
   */
  get nonThumbnailImages() {
    if (this.post && this.post.images) {
      // post is defined and has a defined images array.

      // filter images array by taking images that are not
      // equal to the image given by images[thumbnailIndex].
      // (non thumbnail images)
      return this.post.images.filter(image =>
        image !== this.post.images[this.post.thumbnailIndex]
      );
    }

    // post is not defined or post.images is not defined, return empty array
    return [];
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
  get embedContent() {
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
}
