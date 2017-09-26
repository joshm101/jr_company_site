import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import {
  MdCardModule,
  MdInputModule,
  MdSnackBarModule,
  MdButtonModule,
  MdMenuModule,
  MdToolbarModule,
  MdTabsModule,
  MdIconModule,
  MdTooltipModule,
  MdGridListModule,
  MdProgressSpinnerModule,
  MdDialogModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { WindowRefService } from './external-services/window/window.service';
import { ScreenSizeService } from './external-services/screen-size/screen-size.service';
import { ContentLoadService } from './external-services/content-load/content-load.service';
import { AuthService } from './components/auth/auth.service';
import { EmbedPostService } from './components/embed-post/embed-post.service';
import { AboutService } from './components/interface/interface-about-content/about.service';
import { ContactInfoService } from './components/interface/interface-contact-info-content/contact-info.service';
import { AuthGuardService } from './components/auth/auth-guard.service';
import { authOptionsProvider } from './components/auth/auth-options.service';

import { AppComponent } from './app.component';
import { PublicAudioComponent } from './components/public/public-audio/public-audio.component';
import { PublicBioComponent } from './components/public/public-bio/public-bio.component';
import { PublicContactComponent } from './components/public/public-contact/public-contact.component';
import { PublicHomeComponent } from './components/public/public-home/public-home.component';
import { PublicVideoComponent } from './components/public/public-video/public-video.component';
import { PublicContainerComponent } from './components/public/public-container/public-container.component';
import { LinksComponent } from './components/public/nav-bar/links/links.component';
import { NavBarComponent } from './components/public/nav-bar/nav-bar.component';
import { MenuIconComponent } from './components/public/nav-bar/menu-icon/menu-icon.component';
import { ChangePasswordComponent } from './components/auth/change-password/change-password.component';
import { LoginComponent } from './components/auth/login/login.component';
import { FormComponent } from './auth/login/form/form.component';
import { LoginFormComponent } from './components/auth/login/login-form/login-form.component';
import { EmbedPostComponent } from './components/embed-post/embed-post.component';
import { InterfaceComponent } from './components/interface/interface.component';
import { InterfacePostFormComponent } from './components/interface/interface-post-form/interface-post-form.component';
import { InterfacePostFormImagePreviewComponent } from './components/interface/interface-post-form/interface-post-form-image-preview/interface-post-form-image-preview.component';
import { InterfacePostFormDialogComponent } from './components/interface/interface-post-form/interface-post-form-dialog/interface-post-form-dialog.component';
import { InterfacePostContentComponent } from './components/interface/interface-post-content/interface-post-content.component';
import { FocusedFormDirective } from './directives/focused-form.directive';
import { InterfaceAboutContentComponent } from './components/interface/interface-about-content/interface-about-content.component';
import { InterfaceAboutFormComponent } from './components/interface/interface-about-form/interface-about-form.component';
import { InterfaceAboutFormImagePreviewComponent } from './components/interface/interface-about-form/interface-about-form-image-preview/interface-about-form-image-preview.component';
import { InterfaceContactInfoContentComponent } from './components/interface/interface-contact-info-content/interface-contact-info-content.component';
import { InterfaceContactInfoFormComponent } from './components/interface/interface-contact-info-form/interface-contact-info-form.component';
import { SettingsContentComponent } from './components/settings/settings-content/settings-content.component';
import { SettingsComponent } from './components/settings/settings.component';
import { InterfacePostDeleteConfirmDialogComponent } from './components/interface/interface-post-delete-confirm-dialog/interface-post-delete-confirm-dialog.component';
import { AutoResizeTextareaDirective } from './directives/auto-resize-textarea.directive';
import { InterfaceViewPostComponent } from './components/interface/interface-view-post/interface-view-post.component';

const appRoutes: Routes = [
  { path: '',
    component: PublicContainerComponent,
    children: [
      { path: 'audio', component: PublicAudioComponent },
      { path: 'video', component: PublicVideoComponent },
      { path: 'bio', component: PublicBioComponent },
      { path: 'contact', component: PublicContactComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'interface',
    component: InterfaceComponent,
    children: [
      { path: 'music', component: InterfacePostContentComponent },
      { path: 'field-recordings', component: InterfacePostContentComponent },
      { path: 'film', component: InterfacePostContentComponent },
      { path: 'other', component: InterfacePostContentComponent },
      { path: 'about', component: InterfaceAboutContentComponent },
      { path: 'contact-info', component: InterfaceContactInfoContentComponent },
    ],
    canActivate: [AuthGuardService],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuardService],
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    FormsModule,
    MdCardModule,
    MdSnackBarModule,
    MdInputModule,
    MdButtonModule,
    MdMenuModule,
    MdToolbarModule,
    MdTabsModule,
    MdIconModule,
    MdTooltipModule,
    MdGridListModule,
    MdProgressSpinnerModule,
    FileUploadModule,
    MdDialogModule,
  ],  
  declarations: [
    AppComponent,
    PublicAudioComponent,
    PublicBioComponent,
    PublicContactComponent,
    PublicHomeComponent,
    PublicVideoComponent,
    PublicContainerComponent,
    LinksComponent,
    NavBarComponent,
    MenuIconComponent,
    ChangePasswordComponent,
    LoginComponent,
    FormComponent,
    LoginFormComponent,
    EmbedPostComponent,
    InterfaceComponent,
    InterfacePostFormComponent,
    InterfacePostFormImagePreviewComponent,
    InterfacePostFormDialogComponent,
    InterfacePostContentComponent,
    FocusedFormDirective,
    InterfaceAboutContentComponent,
    InterfaceAboutFormComponent,
    InterfaceAboutFormImagePreviewComponent,
    InterfaceContactInfoContentComponent,
    InterfaceContactInfoFormComponent,
    SettingsContentComponent,
    SettingsComponent,
    InterfacePostDeleteConfirmDialogComponent,
    AutoResizeTextareaDirective,
    InterfaceViewPostComponent
  ],
  providers: [
    WindowRefService,
    ScreenSizeService,
    AuthService,
    AuthGuardService,
    authOptionsProvider,
    EmbedPostService,
    AboutService,
    ContactInfoService,
    ContentLoadService,
  ],
  entryComponents: [
    InterfacePostFormDialogComponent,
    InterfacePostDeleteConfirmDialogComponent,
    InterfaceViewPostComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
