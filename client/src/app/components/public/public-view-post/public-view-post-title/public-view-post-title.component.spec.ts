import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicViewPostTitleComponent } from './public-view-post-title.component';

describe('PublicViewPostTitleComponent', () => {
  let component: PublicViewPostTitleComponent;
  let fixture: ComponentFixture<PublicViewPostTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicViewPostTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicViewPostTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
