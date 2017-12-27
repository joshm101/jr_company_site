import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceBannerImageContentComponent } from './interface-banner-image-content.component';

describe('InterfaceBannerImageContentComponent', () => {
  let component: InterfaceBannerImageContentComponent;
  let fixture: ComponentFixture<InterfaceBannerImageContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfaceBannerImageContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfaceBannerImageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
