import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPostsComponent } from './public-posts.component';

describe('PublicPostsComponent', () => {
  let component: PublicPostsComponent;
  let fixture: ComponentFixture<PublicPostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicPostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
