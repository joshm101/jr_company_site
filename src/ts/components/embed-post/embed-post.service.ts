import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/rx';

import { EmbedPost } from './embed-post.model';
import { AppService } from '../app.service';

@Injectable()
export class EmbedPostService extends AppService<EmbedPost> {
  constructor(http: Http) {
    super(http);
  }

  protected getResource(): string {
    return 'embedPosts';
  }
}
