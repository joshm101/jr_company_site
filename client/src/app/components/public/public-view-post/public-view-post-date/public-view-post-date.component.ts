import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-public-view-post-date',
  templateUrl: './public-view-post-date.component.html',
  styleUrls: ['./public-view-post-date.component.css']
})
export class PublicViewPostDateComponent implements OnInit {
  @Input() date: Date;
  constructor() { }

  ngOnInit() {
  }

}
