import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoot } from './components/app.component';

// components
import { EmbedPostComponent } from './components/embed-post/embed-post.component';
import { EmbedPost } from './components/embed-post/embed-post.model';
import { EmbedPostService } from './components/embed-post/embed-post.service';
import { IndexRootComponent } from './components/index/index.component';
import { InterfaceRootComponent } from './components/interface/interface.component';
import { AddPostComponent } from './components/interface/add-post/add-post.component';
import { AddPostInputComponent } from './components/interface/add-post/input/add-post-input.component';

// directives
import { FocusedFormDirective } from './directives/focused-form.directive';

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
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule
  ],
  declarations: [
    AppRoot,

    // components
    EmbedPostComponent,
    IndexRootComponent,
    InterfaceRootComponent,
    AddPostComponent,
    AddPostInputComponent,

    // directives
    FocusedFormDirective
  ],
  providers: [
    EmbedPostService
  ],
  bootstrap: [AppRoot]
})
export class AppModule {
  constructor() {}
}
