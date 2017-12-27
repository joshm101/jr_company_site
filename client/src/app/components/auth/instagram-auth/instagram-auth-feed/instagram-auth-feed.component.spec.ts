import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramAuthFeedComponent } from './instagram-auth-feed.component';

describe('InstagramAuthFeedComponent', () => {
  let component: InstagramAuthFeedComponent;
  let fixture: ComponentFixture<InstagramAuthFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstagramAuthFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramAuthFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
