import { Component, OnInit, ViewChild } from '@angular/core';
import { MdSidenav } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { Subscription, Observable } from 'rxjs/rx';

import { EmbedPost } from './embed-post/embed-post.model';
import { EmbedPostService } from './embed-post/embed-post.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppRoot  {
  constructor() { }

}
