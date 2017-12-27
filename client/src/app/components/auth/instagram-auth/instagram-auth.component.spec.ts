import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramAuthComponent } from './instagram-auth.component';

describe('InstagramAuthComponent', () => {
  let component: InstagramAuthComponent;
  let fixture: ComponentFixture<InstagramAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstagramAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
