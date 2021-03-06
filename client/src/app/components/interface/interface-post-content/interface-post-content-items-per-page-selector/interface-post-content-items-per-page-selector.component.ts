import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-interface-post-content-items-per-page-selector',
  templateUrl: './interface-post-content-items-per-page-selector.component.html',
  styleUrls: ['./interface-post-content-items-per-page-selector.component.css']
})
export class InterfacePostContentItemsPerPageSelectorComponent implements OnInit {
  @Input()
  public itemsPerPageOptions: number[] = [
    2, 4, 8, 12, 16, 24, 36
  ];
  @Input()
  public itemsPerPageValue: number;
  @Output()
  public itemsPerPageChange: EventEmitter<number>;
  constructor() {
    this.itemsPerPageChange = new EventEmitter<number>();
  }

  ngOnInit() {
  }

  handleItemsPerPageChange(event: any) {
    const { value } = event;
    this.itemsPerPageChange.emit(value);
  }

}
