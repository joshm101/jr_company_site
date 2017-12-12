import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';

import { ConfigService } from '../../../external-services/config/config.service';

import { 
  EmbedPost,
  EmbedPostService, 
} from '../../embed-post/embed-post.index';
import { ContentTypeEnum } from '../../../enums/content-type.enum';

@Component({
  selector: 'app-public-audio',
  templateUrl: './public-audio.component.html',
  styleUrls: ['./public-audio.component.css']
})
export class PublicAudioComponent implements OnInit, OnDestroy {
  posts: EmbedPost[];
  subscriptions: Subscription[] = [];
  constructor(
    private embedPostService: EmbedPostService,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.embedPostService.itemsPerPage = 6;
    this.subscriptions.push(
      this.configService.getConfig().filter(
        config => !!config
      ).map(config => {
        this.embedPostService.itemsPerPage = config.itemsPerPage.contentPages;

      // prevent request that gets cancelled in under 15ms during
      // route transition by debouncing observable emission. The
      // cancelled network request should not be procesed by this
      // component in the first place (since the network request
      // is firing and being cancelled on this component's destroy
      // lifecycle event).
      }).debounceTime(25).switchMap(() => 
        this.embedPostService.getAll({
          params: [
            {
              key: 'content_type',
              value: ContentTypeEnum.Audio
            },
          ]
        })
      ).filter(posts => !!posts).subscribe(
        (posts) => {
          setTimeout(() => {
            window.scrollTo(0, 0);
          }, 0);
          this.posts = posts;
        }
      ),
      this.activatedRoute.queryParamMap.map(paramMap =>
        paramMap.has('page') ? parseInt(paramMap.get('page')) : 1
      ).subscribe(
        (page) => {
          this.embedPostService.setPage(page)
        }
      )
    );
  }

  ngOnInit() {
  }

  goToPreviousPage() {
    if (this.hasPreviousPage) {
      let page = this.embedPostService.currentPage - 1;
      this.router.navigate(
        ['/audio'],
        {
          queryParams: { page }
        }
      );   
    }
  }

  goToNextPage() {
    if (this.hasNextPage) {
      let page = this.embedPostService.currentPage + 1;
      this.router.navigate(
        ['/audio'],
        {
          queryParams: { page }
        }
      );    
    }
  }

  get fourColumnGridMax() {
    const itemsPerPage = this.embedPostService.itemsPerPage;
    return itemsPerPage % 2 === 0 && itemsPerPage !== 6;
  }

  get hasNextPage() {
    return this.embedPostService.hasNextPage();
  }

  get hasPreviousPage() {
    return this.embedPostService.hasPreviousPage();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription =>
      subscription.unsubscribe()
    );
  }

}
