import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceAboutFormImagePreviewComponent } from './interface-about-form-image-preview.component';

describe('InterfaceAboutFormImagePreviewComponent', () => {
  let component: InterfaceAboutFormImagePreviewComponent;
  let fixture: ComponentFixture<InterfaceAboutFormImagePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfaceAboutFormImagePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfaceAboutFormImagePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
