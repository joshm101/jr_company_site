import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-public-view-post-title',
  templateUrl: './public-view-post-title.component.html',
  styleUrls: ['./public-view-post-title.component.css']
})
export class PublicViewPostTitleComponent implements OnInit {
  @Input()
  public title: string;

  constructor() { }

  ngOnInit() {
  }

}
