import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class PublicInstagramFeedService {

  constructor() { }

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

}
