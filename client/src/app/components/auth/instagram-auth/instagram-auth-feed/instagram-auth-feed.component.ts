import { Component, Input, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { InstagramFeedService } from '../../../../external-services/instagram-feed/instagram-feed.service';
import { ScreenSizeService } from '../../../../external-services/screen-size/screen-size.service';

@Component({
  selector: 'app-instagram-auth-feed',
  templateUrl: './instagram-auth-feed.component.html',
  styleUrls: ['./instagram-auth-feed.component.css']
})
export class InstagramAuthFeedComponent implements OnInit {
  public imageSrcs: string[] = [];
  public unableToRetrieveFeed: boolean;
  public cols: number;
  constructor(
    private instagramFeedService: InstagramFeedService,
    private screenSizeService: ScreenSizeService,
  ) {
    this.instagramFeedService.getLatestImages().map(imagesArray =>
      imagesArray.map(arrayItem =>
        arrayItem.images.standard_resolution.url
      )
    ).take(1).retryWhen(errors => errors.delay(1000).take(5)).subscribe(
      (imageSrcArray) => {
        this.imageSrcs = imageSrcArray;
      },
      (error) => {
        this.unableToRetrieveFeed = true;
      }
    );
    this.calculateGridColumns();
  }

  @HostListener('window:resize', ['$event'])
  handleWindowResize(event: any) {
    this.calculateGridColumns();
  } 

  private calculateGridColumns() {
    this.cols = this.screenSizeService.screenWidth > 640 ? 3 : 2;
  }

  get screenWidth() {
    return this.screenSizeService.screenWidth;
  }

  ngOnInit() {
  }

}
