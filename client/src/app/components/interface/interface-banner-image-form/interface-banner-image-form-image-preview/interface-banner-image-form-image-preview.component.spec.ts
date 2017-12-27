import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceBannerImageFormImagePreviewComponent } from './interface-banner-image-form-image-preview.component';

describe('InterfaceBannerImageFormImagePreviewComponent', () => {
  let component: InterfaceBannerImageFormImagePreviewComponent;
  let fixture: ComponentFixture<InterfaceBannerImageFormImagePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfaceBannerImageFormImagePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfaceBannerImageFormImagePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
