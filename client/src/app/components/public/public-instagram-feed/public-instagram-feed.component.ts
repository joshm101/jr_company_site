import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { InstagramFeedService } from '../../../external-services/instagram-feed/instagram-feed.service';

@Component({
  selector: 'app-public-instagram-feed',
  templateUrl: './public-instagram-feed.component.html',
  styleUrls: ['./public-instagram-feed.component.css']
})
export class PublicInstagramFeedComponent implements OnInit {
  public images: any[] = [];
  private imageLoadedLookup: any = {};
  @Input() public cols: number = 3;
  @Input() public shouldLoadImages: boolean = false;
  constructor(
    private instagramFeedService: InstagramFeedService
  ) {
    this.instagramFeedService.getLatestImages().filter(images => 
      !!images
    ).take(1).subscribe(
      (images) => {
        images.forEach(image => {
          this.imageLoadedLookup[image.images.standard_resolution.url] = false;
          let img = new Image();
          img.onload = () => {
            this.imageLoadedLookup[image.images.standard_resolution.url] = true;
          };
          img.src = image.images.standard_resolution.url;
        });
        this.images = images.map(arrayItem => {
          return {
            imageSrc: arrayItem.images.standard_resolution.url,
            imageLink: arrayItem.link
          }
        });
      }
    );
  }

  ngOnInit() {
  }

  goToImageLink(image: any) {
    window.open(image.imageLink, '_blank');
  }

  imageBackgroundStyle(image: any) {
    return `url(${image.imageSrc})`;
  }

  imageIsLoaded(image: any) {
    return this.imageLoadedLookup[image.imageSrc];
  }
}
