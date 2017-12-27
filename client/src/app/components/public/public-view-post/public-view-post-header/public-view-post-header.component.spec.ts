import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicViewPostHeaderComponent } from './public-view-post-header.component';

describe('PublicViewPostHeaderComponent', () => {
  let component: PublicViewPostHeaderComponent;
  let fixture: ComponentFixture<PublicViewPostHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicViewPostHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicViewPostHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
