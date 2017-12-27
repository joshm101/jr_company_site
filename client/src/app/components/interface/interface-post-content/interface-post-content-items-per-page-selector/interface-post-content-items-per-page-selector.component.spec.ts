import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfacePostContentItemsPerPageSelectorComponent } from './interface-post-content-items-per-page-selector.component';

describe('InterfacePostContentItemsPerPageSelectorComponent', () => {
  let component: InterfacePostContentItemsPerPageSelectorComponent;
  let fixture: ComponentFixture<InterfacePostContentItemsPerPageSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfacePostContentItemsPerPageSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfacePostContentItemsPerPageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
