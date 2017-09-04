import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfacePostFormDialogComponent } from './interface-post-form-dialog.component';

describe('InterfacePostFormDialogComponent', () => {
  let component: InterfacePostFormDialogComponent;
  let fixture: ComponentFixture<InterfacePostFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfacePostFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfacePostFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
