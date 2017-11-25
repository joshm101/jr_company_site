import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramAuthRequestDialogComponent } from './instagram-auth-request-dialog.component';

describe('InstagramAuthRequestDialogComponent', () => {
  let component: InstagramAuthRequestDialogComponent;
  let fixture: ComponentFixture<InstagramAuthRequestDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstagramAuthRequestDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramAuthRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
