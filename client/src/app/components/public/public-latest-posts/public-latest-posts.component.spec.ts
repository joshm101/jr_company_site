import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicLatestPostsComponent } from './public-latest-posts.component';

describe('PublicLatestPostsComponent', () => {
  let component: PublicLatestPostsComponent;
  let fixture: ComponentFixture<PublicLatestPostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicLatestPostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicLatestPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
