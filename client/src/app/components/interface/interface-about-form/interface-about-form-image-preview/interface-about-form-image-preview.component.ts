import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-interface-about-form-image-preview',
  templateUrl: './interface-about-form-image-preview.component.html',
  styleUrls: ['./interface-about-form-image-preview.component.css']
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
