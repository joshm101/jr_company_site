import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicAboutLinksComponent } from './public-about-links.component';

describe('PublicAboutLinksComponent', () => {
  let component: PublicAboutLinksComponent;
  let fixture: ComponentFixture<PublicAboutLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicAboutLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicAboutLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
