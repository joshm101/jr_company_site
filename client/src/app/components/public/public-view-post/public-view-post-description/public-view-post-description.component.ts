import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-public-view-post-description',
  templateUrl: './public-view-post-description.component.html',
  styleUrls: ['./public-view-post-description.component.css']
})
export class PublicViewPostDescriptionComponent implements OnInit {
  @Input()
  public description: string;
  constructor() { }

  ngOnInit() {
  }

}
