import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceBannerImageFormComponent } from './interface-banner-image-form.component';

describe('InterfaceBannerImageFormComponent', () => {
  let component: InterfaceBannerImageFormComponent;
  let fixture: ComponentFixture<InterfaceBannerImageFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfaceBannerImageFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfaceBannerImageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
