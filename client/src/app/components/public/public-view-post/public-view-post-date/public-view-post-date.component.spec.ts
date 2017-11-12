import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicViewPostDateComponent } from './public-view-post-date.component';

describe('PublicViewPostDateComponent', () => {
  let component: PublicViewPostDateComponent;
  let fixture: ComponentFixture<PublicViewPostDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicViewPostDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicViewPostDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
