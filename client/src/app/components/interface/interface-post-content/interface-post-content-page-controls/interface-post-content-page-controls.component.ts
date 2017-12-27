import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-interface-post-content-page-controls',
  templateUrl: './interface-post-content-page-controls.component.html',
  styleUrls: ['./interface-post-content-page-controls.component.css']
})
export class InterfacePostContentPageControlsComponent implements OnInit {
  @Input()
  public hasNextPage: boolean;
  @Input()
  public hasPreviousPage: boolean;
  @Output()
  public nextPageClick: EventEmitter<boolean>;
  @Output()
  public previousPageClick: EventEmitter<boolean>;
  constructor() { 
    this.nextPageClick = new EventEmitter<boolean>();
    this.previousPageClick = new EventEmitter<boolean>();
  }

  ngOnInit() {
  }

  handleNextPageClick() {
    this.nextPageClick.emit(true);
  }

  handlePreviousPageClick() {
    this.previousPageClick.emit(true);
  }

}
