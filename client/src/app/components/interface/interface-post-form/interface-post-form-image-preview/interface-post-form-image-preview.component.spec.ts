import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfacePostFormImagePreviewComponent } from './interface-post-form-image-preview.component';

describe('InterfacePostFormImagePreviewComponent', () => {
  let component: InterfacePostFormImagePreviewComponent;
  let fixture: ComponentFixture<InterfacePostFormImagePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfacePostFormImagePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfacePostFormImagePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
