import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicViewPostComponent } from './public-view-post.component';

describe('PublicViewPostComponent', () => {
  let component: PublicViewPostComponent;
  let fixture: ComponentFixture<PublicViewPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicViewPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicViewPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
