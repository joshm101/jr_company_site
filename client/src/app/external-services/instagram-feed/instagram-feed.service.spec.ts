import { TestBed, inject } from '@angular/core/testing';

import { InstagramFeedService } from './instagram-feed.service';

describe('InstagramFeedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InstagramFeedService]
    });
  });

  it('should be created', inject([InstagramFeedService], (service: InstagramFeedService) => {
    expect(service).toBeTruthy();
  }));
});
