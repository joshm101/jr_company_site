import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbedPostComponent } from './embed-post.component';

describe('EmbedPostComponent', () => {
  let component: EmbedPostComponent;
  let fixture: ComponentFixture<EmbedPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbedPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbedPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
