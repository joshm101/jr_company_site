import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoot } from './components/app.component';
import { EmbedPostComponent } from './components/embed-post/embed-post.component';
import { EmbedPost } from './components/embed-post/embed-post.model';
import { EmbedPostService } from './components/embed-post/embed-post.service';
import 'hammerjs';

@NgModule({
  imports: [BrowserModule, HttpModule, MaterialModule.forRoot()],
  declarations: [
    AppRoot,
    EmbedPostComponent
  ],
  providers: [
    EmbedPostService
  ],
  bootstrap: [AppRoot]
})
export class AppModule { }
