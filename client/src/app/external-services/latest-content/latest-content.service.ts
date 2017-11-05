import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { EmbedPost, EmbedPostService } from '../../components/embed-post/embed-post.index';

import { ApiService } from '../../api.service';

@Injectable()
export class LatestContentService {
  
  constructor(
    private apiService: ApiService,
    private embedPostService: EmbedPostService,
  ) {
    embedPostService.itemsPerPage = 4;
  }

  public getLatestPosts() {
    const options = {
      params: [
        {
          key: 'limit',
          value: 4
        },
        {
          key: 'created',
          value: -1
        }
      ]
    };
    return this.embedPostService.getAll(options);
  }

}
