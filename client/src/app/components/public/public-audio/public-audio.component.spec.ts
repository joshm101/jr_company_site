import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicAudioComponent } from './public-audio.component';

describe('PublicAudioComponent', () => {
  let component: PublicAudioComponent;
  let fixture: ComponentFixture<PublicAudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicAudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
