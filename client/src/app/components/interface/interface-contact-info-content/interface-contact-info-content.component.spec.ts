import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceContactInfoContentComponent } from './interface-contact-info-content.component';

describe('InterfaceContactInfoContentComponent', () => {
  let component: InterfaceContactInfoContentComponent;
  let fixture: ComponentFixture<InterfaceContactInfoContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfaceContactInfoContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfaceContactInfoContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
