import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import {
  MatCardModule,
  MatInputModule,
  MatSnackBarModule,
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatTabsModule,
  MatIconModule,
  MatTooltipModule,
  MatGridListModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatProgressBarModule,
  MatSelectModule,
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
import { InstagramFeedService } from './external-services/instagram-feed/instagram-feed.service';
import { ApiService } from './api.service';
import { LatestContentService } from './external-services/latest-content/latest-content.service';
import { BannerImageService } from './components/interface/interface-banner-image-content/banner-image.service';
import { InstagramAuthService } from './components/auth/instagram-auth/instagram-auth.service';
import { ConfigService } from './external-services/config/config.service';
import { UserPreferencesService } from './external-services/user-preferences/user-preferences.service';

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
import { PublicInstagramFeedComponent } from './components/public/public-instagram-feed/public-instagram-feed.component';
import { ScrollInViewDirective } from './directives/scroll-in-view.directive';
import { InterfaceAdditionalContentComponent } from './components/interface/interface-additional-content/interface-additional-content.component';
import { InterfaceBannerImageContentComponent } from './components/interface/interface-banner-image-content/interface-banner-image-content.component';
import { InterfaceBannerImageFormComponent } from './components/interface/interface-banner-image-form/interface-banner-image-form.component';
import { InterfaceBannerImageFormImagePreviewComponent } from './components/interface/interface-banner-image-form/interface-banner-image-form-image-preview/interface-banner-image-form-image-preview.component';
import { PublicBannerImageComponent } from './components/public/public-banner-image/public-banner-image.component';
import { PublicViewPostComponent } from './components/public/public-view-post/public-view-post.component';
import { PublicViewPostHeaderComponent } from './components/public/public-view-post/public-view-post-header/public-view-post-header.component';
import { PublicViewPostTitleComponent } from './components/public/public-view-post/public-view-post-title/public-view-post-title.component';
import { PublicViewPostDateComponent } from './components/public/public-view-post/public-view-post-date/public-view-post-date.component';
import { PublicViewPostEmbedContentComponent } from './components/public/public-view-post/public-view-post-embed-content/public-view-post-embed-content.component';
import { PublicViewPostDescriptionComponent } from './components/public/public-view-post/public-view-post-description/public-view-post-description.component';
import { PublicGamesComponent } from './components/public/public-games/public-games.component';
import { PublicAboutComponent } from './components/public/public-about/public-about.component';
import { InterfacePostContentPageControlsComponent } from './components/interface/interface-post-content/interface-post-content-page-controls/interface-post-content-page-controls.component';
import { InterfacePostContentItemsPerPageSelectorComponent } from './components/interface/interface-post-content/interface-post-content-items-per-page-selector/interface-post-content-items-per-page-selector.component';
import { InstagramAuthComponent } from './components/auth/instagram-auth/instagram-auth.component';
import { InstagramAuthRequestDialogComponent } from './components/auth/instagram-auth/instagram-auth-request-dialog/instagram-auth-request-dialog.component';
import { InstagramAuthRequestDialogStatusTextComponent } from './components/auth/instagram-auth/instagram-auth-request-dialog/instagram-auth-request-dialog-status-text/instagram-auth-request-dialog-status-text.component';
import { InstagramAuthFeedComponent } from './components/auth/instagram-auth/instagram-auth-feed/instagram-auth-feed.component';
import { InstagramAuthFeedImageComponent } from './components/auth/instagram-auth/instagram-auth-feed/instagram-auth-feed-image/instagram-auth-feed-image.component';
import { PublicPostsComponent } from './components/public/public-posts/public-posts.component';
import { PublicPostsPostComponent } from './components/public/public-posts/public-posts-post/public-posts-post.component';
import { PublicPaginationControlButtonComponent } from './components/public/public-pagination-control-button/public-pagination-control-button.component';

const appRoutes: Routes = [
  { path: '',
    component: PublicContainerComponent,
    children: [
      { path: '', component: PublicHomeComponent },
      { path: 'audio', component: PublicAudioComponent },
      { path: 'video', component: PublicVideoComponent },
      { path: 'games', component: PublicGamesComponent },
      { path: 'about', component: PublicAboutComponent },
      { path: 'view', component: PublicViewPostComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'interface',
    component: InterfaceComponent,
    children: [
      { path: 'audio', component: InterfacePostContentComponent },
      { path: 'video', component: InterfacePostContentComponent },
      { path: 'games', component: InterfacePostContentComponent },
      { path: 'additional-content', component: InterfaceAdditionalContentComponent },
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
    MatCardModule,
    MatSnackBarModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatTabsModule,
    MatIconModule,
    MatTooltipModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    FileUploadModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSelectModule,
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
    InterfaceViewPostComponent,
    PublicInstagramFeedComponent,
    ScrollInViewDirective,
    InterfaceAdditionalContentComponent,
    InterfaceBannerImageContentComponent,
    InterfaceBannerImageFormComponent,
    InterfaceBannerImageFormImagePreviewComponent,
    PublicBannerImageComponent,
    PublicViewPostComponent,
    PublicViewPostHeaderComponent,
    PublicViewPostTitleComponent,
    PublicViewPostDateComponent,
    PublicViewPostEmbedContentComponent,
    PublicViewPostDescriptionComponent,
    PublicGamesComponent,
    PublicAboutComponent,
    InterfacePostContentPageControlsComponent,
    InterfacePostContentItemsPerPageSelectorComponent,
    InstagramAuthComponent,
    InstagramAuthRequestDialogComponent,
    InstagramAuthRequestDialogStatusTextComponent,
    InstagramAuthFeedComponent,
    InstagramAuthFeedImageComponent,
    PublicPostsComponent,
    PublicPostsPostComponent,
    PublicPaginationControlButtonComponent,
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
    InstagramFeedService,
    ApiService,
    LatestContentService,
    BannerImageService,
    InstagramAuthService,
    ConfigService,
    UserPreferencesService,
  ],
  entryComponents: [
    InterfacePostFormDialogComponent,
    InterfacePostDeleteConfirmDialogComponent,
    InterfaceViewPostComponent,
    InstagramAuthRequestDialogComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
