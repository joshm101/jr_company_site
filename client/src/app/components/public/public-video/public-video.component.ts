import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { 
  EmbedPost,
  EmbedPostService, 
} from '../../embed-post/embed-post.index';
import { ContentTypeEnum } from '../../../enums/content-type.enum';


@Component({
  selector: 'app-public-video',
  templateUrl: './public-video.component.html',
  styleUrls: ['./public-video.component.css']
})
export class PublicVideoComponent implements OnInit {
  posts$: Observable<EmbedPost[]>;
  constructor(
    private embedPostService: EmbedPostService
  ) {
    this.embedPostService.itemsPerPage = 8;
    this.posts$ = this.embedPostService.getAll({
      params: [
        {
          key: 'content_type',
          value: ContentTypeEnum.Video
        }
      ]
    });
  }

  ngOnInit() {
  }

}
