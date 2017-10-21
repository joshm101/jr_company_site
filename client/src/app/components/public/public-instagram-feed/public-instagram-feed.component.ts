import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { PublicInstagramFeedService } from './public-instagram-feed.service';

@Component({
  selector: 'app-public-instagram-feed',
  templateUrl: './public-instagram-feed.component.html',
  styleUrls: ['./public-instagram-feed.component.css']
})
export class PublicInstagramFeedComponent implements OnInit {
  public images$: Observable<string[]>;
  @Input() public cols: number = 3;
  constructor(
    private publicInstagramFeedService: PublicInstagramFeedService
  ) {
    this.images$ = this.publicInstagramFeedService.getImages();
   }

  ngOnInit() {
  }
}
