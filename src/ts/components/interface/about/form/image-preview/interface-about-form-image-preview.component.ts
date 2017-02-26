import { Component, Input, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'int-about-form-image-preview',
  templateUrl: 'ts/components/interface/about/form/image-preview/interface-about-form-image-preview.component.html'
})
export class InterfaceAboutFormImagePreviewComponent {
  constructor() {
    this.removeImage = new EventEmitter<boolean>();
    this.imageLoaded = new EventEmitter<boolean>();
  }

  // base64 image data or image path
  @Input() imgSrc: string;

  @Output() removeImage: EventEmitter<boolean>;
  @Output() imageLoaded: EventEmitter<boolean>;

  handleImageRemoval(event: Event) {
    this.removeImage.emit(true);
  }
}
