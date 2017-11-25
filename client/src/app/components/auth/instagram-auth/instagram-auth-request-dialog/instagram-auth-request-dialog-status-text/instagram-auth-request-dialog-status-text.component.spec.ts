import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramAuthRequestDialogStatusTextComponent } from './instagram-auth-request-dialog-status-text.component';

describe('InstagramAuthRequestDialogStatusTextComponent', () => {
  let component: InstagramAuthRequestDialogStatusTextComponent;
  let fixture: ComponentFixture<InstagramAuthRequestDialogStatusTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstagramAuthRequestDialogStatusTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramAuthRequestDialogStatusTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
