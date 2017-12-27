import { TestBed, inject } from '@angular/core/testing';

import { ContentLoadService } from './content-load.service';

describe('ContentLoadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentLoadService]
    });
  });

  it('should be created', inject([ContentLoadService], (service: ContentLoadService) => {
    expect(service).toBeTruthy();
  }));
});
