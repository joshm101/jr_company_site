import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfacePostDeleteConfirmDialogComponent } from './interface-post-delete-confirm-dialog.component';

describe('InterfacePostDeleteConfirmDialogComponent', () => {
  let component: InterfacePostDeleteConfirmDialogComponent;
  let fixture: ComponentFixture<InterfacePostDeleteConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfacePostDeleteConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfacePostDeleteConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
