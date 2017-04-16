import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { AuthHttp } from 'angular2-jwt';

import { AppRoot } from './components/app.component';

// components
import { EmbedPostComponent } from './components/embed-post/embed-post.component';
import { EmbedPostService } from './components/embed-post/embed-post.service';
import { IndexRootComponent } from './components/index/index.component';
import { InterfaceRootComponent } from './components/interface/root/interface-root.component';
import { InterfacePostContentComponent } from './components/interface/post/content/interface-post-content.component';
import { InterfacePostFormComponent } from './components/interface/post/form/interface-post-form.component';
import { InterfacePostFormInputComponent } from './components/interface/post/form/input/interface-post-form-input.component';
import { InterfacePostFormDialogComponent } from './components/interface/post/form/dialog/interface-post-form-dialog.component';
import { InterfacePostFormImagePreviewComponent } from './components/interface/post/form/image-preview/interface-post-form-image-preview.component';
import { JDialogComponent } from './components/j-dialog/j-dialog.component';
import { AboutService } from './components/interface/about/about.index';
import { InterfaceAboutContentComponent } from './components/interface/about/interface-about-content';
import { InterfaceAboutFormComponent } from './components/interface/about/form/interface-about-form.component';
import { InterfaceAboutFormImagePreviewComponent } from './components/interface/about/form/image-preview/interface-about-form-image-preview.component';
import { SettingsRootComponent } from './components/settings/settings-root.component';
import { SettingsContentComponent } from './components/settings/content/settings-content.component';
import { AuthChangePasswordComponent } from './components/auth/change-password/auth-change-password.component';
import { AuthLoginComponent } from './components/auth/login/auth-login.component';
import { AuthLoginFormComponent } from './components/auth/login/form/auth-login-form.component';
import { AuthService } from './components/auth/auth.service';
import { AuthGuard } from './components/auth/auth.guard';
import { authOptionsProvider } from './components/auth/auth.options';

// external services
import { ContentLoadService } from './external_services/content-load/content-load.service';
import { ScreenSizeService } from './external_services/screen-size/screen-size.service';

// directives
import { FocusedFormDirective } from './directives/focused-form.directive';

import 'hammerjs';

const appRoutes: Routes = [
  { path: 'interface',
    component: InterfaceRootComponent,
    children: [
      { path: 'music', component: InterfacePostContentComponent },
      { path: 'field-recordings', component: InterfacePostContentComponent },
      { path: 'film', component: InterfacePostContentComponent },
      { path: 'other', component: InterfacePostContentComponent },
      { path: 'about', component: InterfaceAboutContentComponent }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: SettingsRootComponent,
    canActivate: [AuthGuard]
  },
  { path: '', component: IndexRootComponent },
  { path: 'login', component: AuthLoginComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    FileUploadModule,
    FormsModule,
  ],
  declarations: [
    AppRoot,

    // components
    EmbedPostComponent,
    IndexRootComponent,
    InterfaceRootComponent,
    InterfacePostContentComponent,
    InterfacePostFormComponent,
    InterfacePostFormInputComponent,
    InterfacePostFormDialogComponent,
    InterfacePostFormImagePreviewComponent,
    InterfaceAboutContentComponent,
    InterfaceAboutFormComponent,
    InterfaceAboutFormImagePreviewComponent,
    JDialogComponent,
    AuthLoginComponent,
    AuthLoginFormComponent,
    SettingsRootComponent,
    SettingsContentComponent,
    AuthChangePasswordComponent,

    // directives
    FocusedFormDirective
  ],
  entryComponents: [
    JDialogComponent,
    InterfacePostFormDialogComponent
  ],
  providers: [
    EmbedPostService,
    ContentLoadService,
    ScreenSizeService,
    AboutService,
    AuthService,
    AuthGuard,
    AuthHttp,
  ],
  bootstrap: [AppRoot]
})
export class AppModule {
  constructor() {}
}
