import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfacePostFormComponent } from './interface-post-form.component';

describe('InterfacePostFormComponent', () => {
  let component: InterfacePostFormComponent;
  let fixture: ComponentFixture<InterfacePostFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfacePostFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfacePostFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
