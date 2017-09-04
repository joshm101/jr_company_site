import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfacePostFormInputComponent } from './interface-post-form-input.component';

describe('InterfacePostFormInputComponent', () => {
  let component: InterfacePostFormInputComponent;
  let fixture: ComponentFixture<InterfacePostFormInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfacePostFormInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfacePostFormInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
