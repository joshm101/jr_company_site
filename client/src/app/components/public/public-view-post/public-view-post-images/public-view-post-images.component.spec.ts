import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicViewPostImagesComponent } from './public-view-post-images.component';

describe('PublicViewPostImagesComponent', () => {
  let component: PublicViewPostImagesComponent;
  let fixture: ComponentFixture<PublicViewPostImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicViewPostImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicViewPostImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
