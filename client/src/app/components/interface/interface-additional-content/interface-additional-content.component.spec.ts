import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceAdditionalContentComponent } from './interface-additional-content.component';

describe('InterfaceAdditionalContentComponent', () => {
  let component: InterfaceAdditionalContentComponent;
  let fixture: ComponentFixture<InterfaceAdditionalContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfaceAdditionalContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfaceAdditionalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
