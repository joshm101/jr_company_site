import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-interface-banner-image-form-image-preview',
  templateUrl: './interface-banner-image-form-image-preview.component.html',
  styleUrls: ['./interface-banner-image-form-image-preview.component.css']
})
export class InterfaceBannerImageFormImagePreviewComponent {
  @Input()
  imgSrc: string;
  @Output()
  removeImage: EventEmitter<boolean>;
  @Output()
  imageLoaded: EventEmitter<boolean>;

  constructor() {
    this.removeImage = new EventEmitter<boolean>();
    this.imageLoaded = new EventEmitter<boolean>();
  }

  handleImageRemoval(event: Event) {
    this.removeImage.emit(true);
  }

}
