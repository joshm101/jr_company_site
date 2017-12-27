import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicAboutDescriptionComponent } from './public-about-description.component';

describe('PublicAboutDescriptionComponent', () => {
  let component: PublicAboutDescriptionComponent;
  let fixture: ComponentFixture<PublicAboutDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicAboutDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicAboutDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
