import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AppRoot } from './components/app.component';
import { EmbedPostComponent } from './components/embed-post/embed-post.component';
import { EmbedPost } from './components/embed-post/embed-post.model';
import { EmbedPostService } from './components/embed-post/embed-post.service';
import { IndexRootComponent } from './components/index/index.component';
import { InterfaceRootComponent } from './components/interface/interface.component';
import 'hammerjs';

const appRoutes: Routes = [
  { path: 'interface', component: InterfaceRootComponent },
  { path: '', component: IndexRootComponent }
];

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [
    AppRoot,
    EmbedPostComponent,
    IndexRootComponent,
    InterfaceRootComponent
  ],
  providers: [
    EmbedPostService
  ],
  bootstrap: [AppRoot]
})
export class AppModule { }
