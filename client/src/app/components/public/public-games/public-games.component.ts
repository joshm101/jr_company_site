import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { 
  EmbedPost,
  EmbedPostService, 
} from '../../embed-post/embed-post.index';
import { ContentTypeEnum } from '../../../enums/content-type.enum';


@Component({
  selector: 'app-public-games',
  templateUrl: './public-games.component.html',
  styleUrls: ['./public-games.component.css']
})
export class PublicGamesComponent implements OnInit {
  posts$: Observable<EmbedPost[]>;
  constructor(
    private embedPostService: EmbedPostService
  ) {
    this.embedPostService.itemsPerPage = 8;
    this.posts$ = this.embedPostService.getAll({
      params: [
        {
          key: 'content_type',
          value: ContentTypeEnum.Games
        }
      ]
    });
  }

  ngOnInit() {
  }

}
