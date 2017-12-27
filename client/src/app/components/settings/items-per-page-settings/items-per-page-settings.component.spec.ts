import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsPerPageSettingsComponent } from './items-per-page-settings.component';

describe('ItemsPerPageSettingsComponent', () => {
  let component: ItemsPerPageSettingsComponent;
  let fixture: ComponentFixture<ItemsPerPageSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsPerPageSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsPerPageSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
