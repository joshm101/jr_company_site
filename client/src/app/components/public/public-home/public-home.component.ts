import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ScreenSizeService } from '../../../external-services/screen-size/screen-size.service';
import { LatestContentService } from '../../../external-services/latest-content/latest-content.service';
import { EmbedPost, EmbedPostService } from '../../embed-post/embed-post.index';

@Component({
  selector: 'app-public-home',
  templateUrl: './public-home.component.html',
  styleUrls: ['./public-home.component.css']
})
export class PublicHomeComponent implements OnInit, AfterViewInit {
  public latestPosts$: Observable<EmbedPost[]>;
  public shouldLoadInstagramFeed: boolean = false;
  public shouldLoadTwitterFeed: boolean = false;  
  public shouldLoadSoundcloudWidget: boolean = false;
  constructor(
    private _screenSizeService: ScreenSizeService,
    private latestContentService: LatestContentService,
    private embedPostService: EmbedPostService
  ) {
    this.latestPosts$ = this.latestContentService.getLatestPosts();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
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

  triggerInstagramFeedLoad() {
    this.shouldLoadInstagramFeed = true;
  }

  triggerTwitterFeedLoad() {
    if (!this.shouldLoadTwitterFeed) {
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
    } else {
      // trigger a reload if already previously loaded.
      // this is typically done if returning back to
      // home page via router.
      window['twttr'] && window['twttr'].widgets.load();
    }
    this.shouldLoadTwitterFeed = true;
  }

  get fourColumnGridMax() {
    const itemsPerPage = this.embedPostService.itemsPerPage;
    return itemsPerPage % 2 === 0 && itemsPerPage !== 6;    
  }

  triggerSoundcloudWidgetLoad() {
    this.shouldLoadSoundcloudWidget = true;
  }

}
