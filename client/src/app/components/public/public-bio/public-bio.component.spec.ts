import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicBioComponent } from './public-bio.component';

describe('PublicBioComponent', () => {
  let component: PublicBioComponent;
  let fixture: ComponentFixture<PublicBioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicBioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicBioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
