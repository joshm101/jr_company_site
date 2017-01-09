import { Component, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs/rx';

import { EmbedPost } from './embed-post.model';
import { EmbedPostService } from './embed-post.service';


@Component({
  selector: 'embed-post',
  templateUrl: 'ts/components/embed-post/embed-post.component.html'
})
export class EmbedPostComponent {
  constructor(

  ) {


  }
  @Input() post: EmbedPost;


}
