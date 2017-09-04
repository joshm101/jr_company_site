import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceAboutContentComponent } from './interface-about-content.component';

describe('InterfaceAboutContentComponent', () => {
  let component: InterfaceAboutContentComponent;
  let fixture: ComponentFixture<InterfaceAboutContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfaceAboutContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfaceAboutContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
