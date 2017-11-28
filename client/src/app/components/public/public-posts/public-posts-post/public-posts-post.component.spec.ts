import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPostsPostComponent } from './public-posts-post.component';

describe('PublicPostsPostComponent', () => {
  let component: PublicPostsPostComponent;
  let fixture: ComponentFixture<PublicPostsPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicPostsPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPostsPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
