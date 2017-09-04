import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfacePostContentComponent } from './interface-post-content.component';

describe('InterfacePostContentComponent', () => {
  let component: InterfacePostContentComponent;
  let fixture: ComponentFixture<InterfacePostContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfacePostContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfacePostContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
