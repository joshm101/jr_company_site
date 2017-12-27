import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { InstagramAuthService } from '../../../auth/instagram-auth/instagram-auth.service';
import { InstagramFeedService } from '../../../../external-services/instagram-feed/instagram-feed.service';

@Component({
  selector: 'app-instagram-auth-request-dialog',
  templateUrl: './instagram-auth-request-dialog.component.html',
  styleUrls: ['./instagram-auth-request-dialog.component.css']
})
export class InstagramAuthRequestDialogComponent implements OnInit {
  public statuses: any[] = [];
  private obtainedAccessToken: boolean = false;
  public requestInFlight: boolean = false;
  public successfulRequest: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<InstagramAuthRequestDialogComponent>,
    private instagramAuthService: InstagramAuthService,
    private instagramFeedService: InstagramFeedService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.requestInFlight = true;    
    this.statuses.push({
      discreteEvent: false,
      text: 'Obtaining access token...'
    });
    this.instagramAuthService.obtainAccessToken(data['code']).switchMap(res => {
      this.statuses.push(
        {
          discreteEvent: true,
          text: 'Access token obtained.'
        },
        {
          discreteEvent: false,
          text: 'Retrieving images...'
        }
      );
      this.obtainedAccessToken = true;
      return this.instagramFeedService.getLatestImages();
    }).filter(res =>
      !!res
    ).take(1).subscribe(
      (_) => {
        // successfully obtained an access token and retrieved images
        // using that access token.
        this.successfulRequest = true;
        this.requestInFlight = false;
        this.setSuccessMessages();
      },
      (error) => {
        this.successfulRequest = false;
        this.requestInFlight = false;
        console.error("Error: ", error.message);
        let errorMessage = '';
        if (this.obtainedAccessToken) {
          errorMessage = (
            `An access token was obtained, but there was an error while ` +
            `fetching the latest images from Instagram:
            ${error.message}
            `
          );
        } else {
          errorMessage = (
            `There was an error while obtaining an access token: 
            ${error.message}
            `
          );
        }
        this.statuses.push({
          discreteEvent: true,
          text: errorMessage,
          textAlign: 'left'
        });
      }
    )
  }

  ngOnInit() {
  }

  setSuccessMessages() {
    this.statuses.push(
      {
        discreteEvent: true,
        text: 'Success!'
      },
      {
        discreteEvent: true,
        text: (
          `An access token was obtained and your Instagram feed ` +
          `was successfully retrieved. ` +
          `You should now see your Instagram images loaded ` +
          `(or in the process of loading) when you close this ` +
          `dialog. ` + 
          `The home page should now properly load and display ` +
          `your Instagram feed.`
        ),
        textAlign: 'left'
      }
    );
  }

  handleRetryButtonClick() {
    location.href = "/settings";
  }

}
