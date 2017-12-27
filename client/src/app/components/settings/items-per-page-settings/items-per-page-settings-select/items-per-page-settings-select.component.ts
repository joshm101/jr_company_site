import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  OnInit 
} from '@angular/core';

@Component({
  selector: 'app-items-per-page-settings-select',
  templateUrl: './items-per-page-settings-select.component.html',
  styleUrls: ['./items-per-page-settings-select.component.css']
})
export class ItemsPerPageSettingsSelectComponent implements OnInit {
  @Input()
  public label: string = 'Items per page';
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
