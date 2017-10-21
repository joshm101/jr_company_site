import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicInstagramFeedComponent } from './public-instagram-feed.component';

describe('PublicInstagramFeedComponent', () => {
  let component: PublicInstagramFeedComponent;
  let fixture: ComponentFixture<PublicInstagramFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicInstagramFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicInstagramFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
