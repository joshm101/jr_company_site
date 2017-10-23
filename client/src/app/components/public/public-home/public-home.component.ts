import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ScreenSizeService } from '../../../external-services/screen-size/screen-size.service';
import { LatestContentService } from '../../../external-services/latest-content/latest-content.service';
import { EmbedPost } from '../../embed-post/embed-post.index';

@Component({
  selector: 'app-public-home',
  templateUrl: './public-home.component.html',
  styleUrls: ['./public-home.component.css']
})
export class PublicHomeComponent implements OnInit, AfterViewInit {
  public latestPosts$: Observable<EmbedPost[]>;
  constructor(
    private _screenSizeService: ScreenSizeService,
    private latestContentService: LatestContentService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    !function(d,s,id){
      var js: any,
          fjs=d.getElementsByTagName(s)[0],
          p='https';
      if(!d.getElementById(id)){
          js=d.createElement(s);
          js.id=id;
          js.src=p+"://platform.twitter.com/widgets.js";
          fjs.parentNode.insertBefore(js,fjs);
      }
    } 
    (document,"script","twitter-wjs");    
  }

  get screenWidth() {
    return this._screenSizeService.screenWidth;
  }

  get instagramFeedCols() {
    if (this.screenWidth > 991) {
      return 3;
    }
    return 2;
  }

}
