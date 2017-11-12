import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicViewPostEmbedContentComponent } from './public-view-post-embed-content.component';

describe('PublicViewPostEmbedContentComponent', () => {
  let component: PublicViewPostEmbedContentComponent;
  let fixture: ComponentFixture<PublicViewPostEmbedContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicViewPostEmbedContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicViewPostEmbedContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
