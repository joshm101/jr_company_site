import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

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
export class PublicAudioComponent implements OnInit {
  posts$: Observable<EmbedPost[]>;
  constructor(
    private embedPostService: EmbedPostService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.embedPostService.itemsPerPage = 6;
    this.posts$ = this.embedPostService.getAll({
      params: [
        {
          key: 'content_type',
          value: ContentTypeEnum.Audio
        },
      ]
    })
    
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
