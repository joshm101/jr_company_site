import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicVideoComponent } from './public-video.component';

describe('PublicVideoComponent', () => {
  let component: PublicVideoComponent;
  let fixture: ComponentFixture<PublicVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
