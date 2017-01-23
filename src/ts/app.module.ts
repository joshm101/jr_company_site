import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';

import { AppRoot } from './components/app.component';

// components
import { EmbedPostComponent } from './components/embed-post/embed-post.component';
import { EmbedPost } from './components/embed-post/embed-post.model';
import { EmbedPostService } from './components/embed-post/embed-post.service';
import { IndexRootComponent } from './components/index/index.component';
import { InterfaceRootComponent } from './components/interface/interface.component';
import { PostFormComponent } from './components/interface/post-form/post-form.component';
import { PostFormInputComponent } from './components/interface/post-form/input/post-form-input.component';
import { JDialogComponent } from './components/j-dialog/j-dialog.component';
import { PostFormDialogComponent } from './components/interface/post-form/post-form-dialog/post-form-dialog.component';
import { PostFormImagePreviewComponent } from './components/interface/post-form/image-preview/post-form-image-preview.component';

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
    ReactiveFormsModule,
    FileUploadModule
  ],
  declarations: [
    AppRoot,

    // components
    EmbedPostComponent,
    IndexRootComponent,
    InterfaceRootComponent,
    PostFormComponent,
    PostFormInputComponent,
    JDialogComponent,
    PostFormDialogComponent,
    PostFormImagePreviewComponent,

    // directives
    FocusedFormDirective
  ],
  entryComponents: [
    JDialogComponent,
    PostFormDialogComponent
  ],
  providers: [
    EmbedPostService
  ],
  bootstrap: [AppRoot]
})
export class AppModule {
  constructor() {}
}
