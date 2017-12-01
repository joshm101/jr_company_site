import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
    private embedPostService: EmbedPostService,
    private router: Router,
    private activatedRoute: ActivatedRoute
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

  get hasNextPage() {
    return this.embedPostService.hasNextPage();
  }

  get hasPreviousPage() {
    return this.embedPostService.hasPreviousPage();
  }

}
