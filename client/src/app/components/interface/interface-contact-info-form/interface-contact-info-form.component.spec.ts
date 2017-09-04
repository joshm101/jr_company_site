import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceContactInfoFormComponent } from './interface-contact-info-form.component';

describe('InterfaceContactInfoFormComponent', () => {
  let component: InterfaceContactInfoFormComponent;
  let fixture: ComponentFixture<InterfaceContactInfoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfaceContactInfoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfaceContactInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
