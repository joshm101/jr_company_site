import { TestBed, inject } from '@angular/core/testing';

import { LatestContentService } from './latest-content.service';

describe('LatestContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LatestContentService]
    });
  });

  it('should be created', inject([LatestContentService], (service: LatestContentService) => {
    expect(service).toBeTruthy();
  }));
});
