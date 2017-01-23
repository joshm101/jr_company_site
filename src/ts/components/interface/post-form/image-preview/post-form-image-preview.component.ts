import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'post-form-image-preview',
  templateUrl: 'ts/components/interface/post-form/image-preview/post-form-image-preview.component.html'
})
export class PostFormImagePreviewComponent {
  constructor(

  ) {
    this.setAsThumbnail = new EventEmitter<boolean>();
    this.removeImage = new EventEmitter<boolean>();
  }

  removeThisImage(event: Event) {
    this.removeImage.emit(true);
  }

  setThisImageAsThumbnail(event: Event) {
    this.setAsThumbnail.emit(true);
  }

  // base64 image data
  @Input() imgData: string;
  @Input() isThumbnail: boolean = false;

  // Event emitted when this image
  // is selected as the thumbnail
  // so that the parent form component
  // can keep data model consistent
  @Output() setAsThumbnail: EventEmitter<boolean>;

  // Event emitted when this image is
  // selected to be removed so that the
  // parent form component can keep
  // data model consistent
  @Output() removeImage: EventEmitter<boolean>;
}
