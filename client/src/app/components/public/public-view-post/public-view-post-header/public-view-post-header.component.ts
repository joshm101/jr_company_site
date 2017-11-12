import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-public-view-post-header',
  templateUrl: './public-view-post-header.component.html',
  styleUrls: ['./public-view-post-header.component.css']
})
export class PublicViewPostHeaderComponent implements OnInit {
  @Input()
  public date: Date;
  @Input()
  public title: string;
  constructor() { }

  ngOnInit() {
  }

}
