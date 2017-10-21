import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicLatestPostsPostComponent } from './public-latest-posts-post.component';

describe('PublicLatestPostsPostComponent', () => {
  let component: PublicLatestPostsPostComponent;
  let fixture: ComponentFixture<PublicLatestPostsPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicLatestPostsPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicLatestPostsPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
