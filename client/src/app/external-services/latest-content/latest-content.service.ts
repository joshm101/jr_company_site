import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { EmbedPost, EmbedPostService } from '../../components/embed-post/embed-post.index';
import { ConfigService } from '../../external-services/config/config.service';
import { ApiService } from '../../api.service';
import { ContentTypeEnum } from '../../enums/content-type.enum';

@Injectable()
export class LatestContentService {
  
  constructor(
    private apiService: ApiService,
    private embedPostService: EmbedPostService,
    private configService: ConfigService
  ) {
  }

  public getLatestPosts() {
    return this.configService.getConfig().filter(
      config => !!config
    ).map(config => {
      this.embedPostService.itemsPerPage = config.itemsPerPage.latestContent;
      const options = {
        params: [
          {
            key: 'created',
            value: -1
          }
        ]
      };
      return options;
    }).map(options => 
      this.embedPostService.getAll(options)
    ).switchMap(posts$ => {
      return Observable.combineLatest(
        posts$,

        // use apiService directly to circumvent
        // cache overwrite. If we use embedPostService
        // to fetch the reel post, the current cache
        // mechanism will cause the reel post fetch
        // to overwrite the results from latest content
        // fetch (the getAll() call above). So use the
        // apiService directly for fetching the reel post
        // to avoid cache issues.
        this.apiService.get(
          'api/embedPosts',
          {
            params: [
              {
                key: 'page',
                value: 1
              },
              {
                key: 'limit',
                value: 1
              },
              {
                key: 'content_type',
                value: ContentTypeEnum.Reel
              }
            ]
          }
        ).map((res: any) => {
          let body = res['data'];
          let temp: EmbedPost[] = [];
          temp = body.map(item => this.embedPostService.new(item));
          temp.forEach(post => {
            post.embedContentSafe = [];
            this.embedPostService.createSafeHtml(post);
          });
          return temp;
        }).catch(this.apiService.handleError)
      )
    }).map(([latestPosts, reelPosts]) => {
      console.log("latestPosts: ", latestPosts);
      console.log("reelPosts: ", reelPosts);
      let reelPost = undefined;
      let result: EmbedPost[] = [];
      // check if there is at least one reel post
      if (reelPosts[0]) {
        reelPost = reelPosts[0];

        // filter out reel post from latest posts
        // list if it exists in that array
        latestPosts = latestPosts.filter(post =>
          post._id !== reelPost._id
        );
        result = [reelPost].concat(latestPosts);

        if (result.length > this.embedPostService.itemsPerPage) {
          // result is greater than items per page because reel
          // post was not present in latest posts array, so it
          // was not filtered out. Concatenating latest posts
          // to reel post would result in an array that's
          // 1 greater than the currently set itemsPerPage.
          result.pop();
        }
      }

      if (!reelPosts[0]) {
        // reel post does not exist, just 
        // return list of latest posts
        result = latestPosts;
      }

      return result;
    });
  }

}
