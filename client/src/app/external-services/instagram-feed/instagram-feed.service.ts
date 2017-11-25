import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { ApiService } from '../../api.service';

@Injectable()
export class InstagramFeedService {
  private feed: BehaviorSubject<any[]>;
  public feed$: Observable<any[]>;
  constructor(
    private api: ApiService
  ) { 
    this.feed = new BehaviorSubject<any[]>([]);
    this.feed$ = this.feed.asObservable();
  }

  getImages(): Observable<string[]> { 
    return Observable.of([
      "images/grid_images/1.jpg",
      "images/grid_images/2.jpg",
      "images/grid_images/3.jpg",
      "images/grid_images/4.jpg",
      "images/grid_images/5.jpg",
      "images/grid_images/6.jpg",
    ]);
  }

  getLatestImages(): Observable<any> {
    return this.api.get('api/instagramFeed/').switchMap(res => {
      this.feed.next(
        [
          ...res['data']
        ]
      );
      return this.feed$;
    }).catch(err => {
      console.log("feed err: ", err);
      throw new Error(err.error.error);
    });
  }

}
