import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceAboutFormComponent } from './interface-about-form.component';

describe('InterfaceAboutFormComponent', () => {
  let component: InterfaceAboutFormComponent;
  let fixture: ComponentFixture<InterfaceAboutFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfaceAboutFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfaceAboutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
