import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPaginationControlButtonComponent } from './public-pagination-control-button.component';

describe('PublicPaginationControlButtonComponent', () => {
  let component: PublicPaginationControlButtonComponent;
  let fixture: ComponentFixture<PublicPaginationControlButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicPaginationControlButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPaginationControlButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
