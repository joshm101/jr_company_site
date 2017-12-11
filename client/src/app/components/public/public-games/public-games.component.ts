import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';

import { 
  EmbedPost,
  EmbedPostService, 
} from '../../embed-post/embed-post.index';
import { ContentTypeEnum } from '../../../enums/content-type.enum';
import { ConfigService } from '../../../external-services/config/config.service';


@Component({
  selector: 'app-public-games',
  templateUrl: './public-games.component.html',
  styleUrls: ['./public-games.component.css']
})
export class PublicGamesComponent implements OnInit, OnDestroy {
  posts: EmbedPost[];
  subscriptions: Subscription[] = [];
  constructor(
    private embedPostService: EmbedPostService,
    private configService: ConfigService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.configService.getConfig().filter(
      config => !!config
    ).map(config => {
      this.embedPostService.itemsPerPage = config.itemsPerPage.contentPages;
    }).switchMap(() => 
      this.embedPostService.getAll({
        params: [
          {
            key: 'content_type',
            value: ContentTypeEnum.Games
          },
        ]
      })
    ).filter(posts => !!posts).subscribe(
      (posts) => {
        this.posts = posts;
      }
    )

    this.activatedRoute.queryParamMap.map(paramMap =>
      paramMap.has('page') ? parseInt(paramMap.get('page')) : 1
    ).subscribe(
      (page) => {
        this.embedPostService.setPage(page)
      }
    )    
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
