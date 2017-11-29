import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-public-pagination-control-button',
  templateUrl: './public-pagination-control-button.component.html',
  styleUrls: ['./public-pagination-control-button.component.css']
})
export class PublicPaginationControlButtonComponent implements OnInit {
  @Input()
  public text: string = '< >'
  constructor() { }

  ngOnInit() {
  }

}
