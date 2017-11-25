import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';

import { ConfigService } from '../../../external-services/config/config.service';

import { 
  InstagramAuthRequestDialogComponent 
} from './instagram-auth-request-dialog/instagram-auth-request-dialog.component';

@Component({
  selector: 'app-instagram-auth',
  templateUrl: './instagram-auth.component.html',
  styleUrls: ['./instagram-auth.component.css']
})
export class InstagramAuthComponent implements OnInit {
  public disableAuthSetupButton: boolean;
  private clientId: string;
  private redirectUri: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private configService: ConfigService,
    public dialog: MatDialog
  ) {
    this.activatedRoute.queryParamMap.filter(
      queryParamMap => !!queryParamMap
    ).take(1).subscribe(
      (paramMap) => {
        const code = paramMap.get('code');
        if (code) {
          // a code query parameter has been supplied
          // to this route. Instagram auth setup is
          // currently happening, so disable auth setup
          // button.
          this.disableAuthSetupButton = true;

          let dialogRef = this.dialog.open(InstagramAuthRequestDialogComponent, {
            width: '500px',
            data: {
              code
            }
          });
          dialogRef.afterClosed().take(1).subscribe(result => {
            this.disableAuthSetupButton = false;
          })
        }
      }, 
      (error) => {
        console.error(error);
      }
    );
    
    this.configService.getConfig().filter(
      config => !!config
    ).take(1).subscribe(
      (config) => {
        this.clientId = config.instagram.clientId;
        this.redirectUri = config.instagram.redirectUri;
      },
      (err) => {
        console.error(err);
      }
    )

  }

  get instagramAuthInitializationUrl() {
    if (this.clientId && this.redirectUri) {
      return (
        `https://api.instagram.com/oauth/authorize/?` +
        `client_id=${this.clientId}&` +
        `redirect_uri=${this.redirectUri}&` +
        `response_type=code`
      );
    }
    return undefined;
  }

  handleInstagramAuthInitializationButtonClick() {
    window.location.href = this.instagramAuthInitializationUrl;
  }

  ngOnInit() {
  }

}
