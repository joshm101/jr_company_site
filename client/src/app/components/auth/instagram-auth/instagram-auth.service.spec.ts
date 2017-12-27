import { TestBed, inject } from '@angular/core/testing';

import { InstagramAuthService } from './instagram-auth.service';

describe('InstagramAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InstagramAuthService]
    });
  });

  it('should be created', inject([InstagramAuthService], (service: InstagramAuthService) => {
    expect(service).toBeTruthy();
  }));
});
