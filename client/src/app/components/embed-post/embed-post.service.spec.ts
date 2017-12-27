import { TestBed, inject } from '@angular/core/testing';

import { EmbedPostService } from './embed-post.service';

describe('EmbedPostService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmbedPostService]
    });
  });

  it('should be created', inject([EmbedPostService], (service: EmbedPostService) => {
    expect(service).toBeTruthy();
  }));
});
