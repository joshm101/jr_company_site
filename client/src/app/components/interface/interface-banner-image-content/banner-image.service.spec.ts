import { TestBed, inject } from '@angular/core/testing';

import { BannerImageService } from './banner-image.service';

describe('BannerImageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BannerImageService]
    });
  });

  it('should be created', inject([BannerImageService], (service: BannerImageService) => {
    expect(service).toBeTruthy();
  }));
});
