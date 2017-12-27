import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicBannerImageComponent } from './public-banner-image.component';

describe('PublicBannerImageComponent', () => {
  let component: PublicBannerImageComponent;
  let fixture: ComponentFixture<PublicBannerImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicBannerImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicBannerImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
