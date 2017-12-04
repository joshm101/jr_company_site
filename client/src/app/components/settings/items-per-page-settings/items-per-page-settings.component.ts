import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Rx';

import { ConfigService } from '../../../external-services/config/config.service';

@Component({
  selector: 'app-items-per-page-settings',
  templateUrl: './items-per-page-settings.component.html',
  styleUrls: ['./items-per-page-settings.component.css']
})
export class ItemsPerPageSettingsComponent implements OnInit, OnDestroy {
  public latestContentItemsPerPageOptions: number[] = [
    4, 6, 8, 10, 12, 16
  ];
  public latestContentSelectLabel = 'Items to Display';;

  public contentPagesItemsPerPageOptions: number[] = [
    4, 6, 8, 10, 12, 16, 20, 24, 32, 64
  ];
  public contentPagesItemsPerPageSelectLabel = 'Items per Page';
  public contentPagesItemsPerPageUpdateInFlight = false;
  public latestContentItemsPerPageUpdateInFlight = false;
  public contentPagesItemsPerPage: number;
  public latestContentItemsPerPage: number;

  private subscriptions: Subscription[];
  private config: any;
  constructor(
    private snackBar: MatSnackBar,
    private configService: ConfigService,
  ) {
    this.subscriptions = [];
    this.subscriptions.push(
      this.configService.getConfig().filter(config => !!config).subscribe(
        (config) => {
          this.contentPagesItemsPerPage = config.itemsPerPage.contentPages;
          this.latestContentItemsPerPage = config.itemsPerPage.latestContent;
          this.config = config;
        }
      )
    );
  }

  ngOnInit() {
  }

  public contentPagesItemsPerPageChange(value: number) {
    let oldConfig = this.config;
    let newConfig = Object.assign(
      {},
      oldConfig,
      {
        itemsPerPage: {
          contentPages: value,
          latestContent: this.latestContentItemsPerPage,
        }
      }
    );
    this.contentPagesItemsPerPageUpdateInFlight = true;
    this.makeUpdateRequest(
      newConfig, 
      this.contentPagesItemsPerPageUpdateSuccess.bind(this)
    );
  }

  public latestContentItemsPerPageChange(value: number) {
    let oldConfig = this.config;
    let newConfig = Object.assign(
      {},
      oldConfig,
      {
        itemsPerPage: {
          latestContent: value,
          contentPages: this.contentPagesItemsPerPage,
        }
      }
    );
    this.latestContentItemsPerPageUpdateInFlight = true;
    this.makeUpdateRequest(
      newConfig,
      this.latestContentItemsPerPageUpdateSuccess.bind(this)
    );
  }

  private makeUpdateRequest(
    configObject: any, 
    successCallback: (config: any) => void
  ) {
    this.configService.updateConfig(configObject).take(1).subscribe(
      (config) => { successCallback(config); },
      (error) => {
        this.snackBar.open(
          'There was an error while updating. Reverting to previous selection.',
          '',
          {
            duration: 4000
          }
        );
        this.latestContentItemsPerPage = this.config.itemsPerPage.latestContent;
        this.contentPagesItemsPerPage = this.config.itemsPerPage.contentPages;
      }
    )
  }

  private contentPagesItemsPerPageUpdateSuccess(config) {
    this.contentPagesItemsPerPage = config.itemsPerPage.contentPages;
    this.config = config;
    this.contentPagesItemsPerPageUpdateInFlight = false;
    this.displaySuccessMessage('Items per page saved.');
  }

  private latestContentItemsPerPageUpdateSuccess(config) {
    this.latestContentItemsPerPage = config.itemsPerPage.latestContent;
    this.config = config;
    this.latestContentItemsPerPageUpdateInFlight = false;
    this.displaySuccessMessage('Items to display saved.');
  }

  private displaySuccessMessage(message: string = 'Saved.') {
    this.snackBar.open(
      message,
      '',
      {
        duration: 4000
      }
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription =>
      subscription.unsubscribe()
    );
  }

}
