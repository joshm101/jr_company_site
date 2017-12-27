import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicViewPostDescriptionComponent } from './public-view-post-description.component';

describe('PublicViewPostDescriptionComponent', () => {
  let component: PublicViewPostDescriptionComponent;
  let fixture: ComponentFixture<PublicViewPostDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicViewPostDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicViewPostDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
