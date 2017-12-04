import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { EmbedPost, EmbedPostService } from '../../components/embed-post/embed-post.index';
import { ConfigService } from '../../external-services/config/config.service';
import { ApiService } from '../../api.service';

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
    }).switchMap(options => this.embedPostService.getAll(options))
  }

}
