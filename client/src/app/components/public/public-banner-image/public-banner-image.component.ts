import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { BannerImage, BannerImageService } from '../../interface/interface-banner-image-content/banner-image.index';

@Component({
  selector: 'app-public-banner-image',
  templateUrl: './public-banner-image.component.html',
  styleUrls: ['./public-banner-image.component.css']
})
export class PublicBannerImageComponent implements OnInit {
  @Input()
  public bannerImageSrc$: Observable<string>;
  public imageLoaded: boolean = false;
  constructor(
    private bannerImageService: BannerImageService
  ) {
    this.bannerImageSrc$ = this.bannerImageService.getAll().map(images =>
      images[0]
    ).map(bannerImage => bannerImage.image);
  }

  ngOnInit() {
  }

  handleBannerImageLoadedEvent() {
    this.imageLoaded = true;
  }

}
