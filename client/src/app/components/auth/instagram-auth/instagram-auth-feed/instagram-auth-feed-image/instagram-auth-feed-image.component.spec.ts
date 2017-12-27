import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramAuthFeedImageComponent } from './instagram-auth-feed-image.component';

describe('InstagramAuthFeedImageComponent', () => {
  let component: InstagramAuthFeedImageComponent;
  let fixture: ComponentFixture<InstagramAuthFeedImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstagramAuthFeedImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramAuthFeedImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
