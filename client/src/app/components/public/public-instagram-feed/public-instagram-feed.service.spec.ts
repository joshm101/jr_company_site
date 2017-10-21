import { TestBed, inject } from '@angular/core/testing';

import { PublicInstagramFeedService } from './public-instagram-feed.service';

describe('PublicInstagramFeedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PublicInstagramFeedService]
    });
  });

  it('should be created', inject([PublicInstagramFeedService], (service: PublicInstagramFeedService) => {
    expect(service).toBeTruthy();
  }));
});
