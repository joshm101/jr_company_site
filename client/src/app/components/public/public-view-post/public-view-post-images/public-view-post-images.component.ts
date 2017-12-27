import { Component, Input, OnInit } from '@angular/core';

import { Image } from 'angular-modal-gallery';


@Component({
  selector: 'app-public-view-post-images',
  templateUrl: './public-view-post-images.component.html',
  styleUrls: ['./public-view-post-images.component.css']
})
export class PublicViewPostImagesComponent implements OnInit {
  @Input()
  public images: string[] = [];
  @Input()
  public modalGalleryImages: Image[] = [];
  constructor() { }

  ngOnInit() {
    this.modalGalleryImages = this.images.map(image =>
      new Image(
        image,
        null,
        null,
        null
      )
    );
  }

}
