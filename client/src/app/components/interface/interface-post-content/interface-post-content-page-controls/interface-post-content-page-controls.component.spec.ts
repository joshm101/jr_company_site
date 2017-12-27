import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfacePostContentPageControlsComponent } from './interface-post-content-page-controls.component';

describe('InterfacePostContentPageControlsComponent', () => {
  let component: InterfacePostContentPageControlsComponent;
  let fixture: ComponentFixture<InterfacePostContentPageControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfacePostContentPageControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfacePostContentPageControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
