import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceViewPostComponent } from './interface-view-post.component';

describe('InterfaceViewPostComponent', () => {
  let component: InterfaceViewPostComponent;
  let fixture: ComponentFixture<InterfaceViewPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfaceViewPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfaceViewPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
