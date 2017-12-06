import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicAboutImageComponent } from './public-about-image.component';

describe('PublicAboutImageComponent', () => {
  let component: PublicAboutImageComponent;
  let fixture: ComponentFixture<PublicAboutImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicAboutImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicAboutImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
