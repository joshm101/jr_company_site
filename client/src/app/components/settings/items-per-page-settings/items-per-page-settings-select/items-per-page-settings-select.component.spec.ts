import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsPerPageSettingsSelectComponent } from './items-per-page-settings-select.component';

describe('ItemsPerPageSettingsSelectComponent', () => {
  let component: ItemsPerPageSettingsSelectComponent;
  let fixture: ComponentFixture<ItemsPerPageSettingsSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsPerPageSettingsSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsPerPageSettingsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
