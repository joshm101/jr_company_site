import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { InstagramFeedService } from '../../../external-services/instagram-feed/instagram-feed.service';

@Component({
  selector: 'app-public-instagram-feed',
  templateUrl: './public-instagram-feed.component.html',
  styleUrls: ['./public-instagram-feed.component.css']
})
export class PublicInstagramFeedComponent implements OnInit {
  public images$: Observable<string[]>;
  @Input() public cols: number = 3;
  @Input() public shouldLoadImages: boolean = false;
  constructor(
    private instagramFeedService: InstagramFeedService
  ) {
    this.images$ = this.instagramFeedService.getImages();
   }

  ngOnInit() {
  }
}
