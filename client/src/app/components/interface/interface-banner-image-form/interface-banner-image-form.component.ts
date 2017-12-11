import { Component, trigger, transition, style, state, animate, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material';

import { BannerImage, BannerImageService } from '../interface-banner-image-content/banner-image.index';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-interface-banner-image-form',
  animations: [
    trigger(
      'interfaceState', [
        state('inactive', style({opacity: 0})),
        state('active', style({opacity: 1})),
        transition('inactive => active', animate('300ms ease-in')),
        transition('active => inactive', animate('300ms ease-out'))
      ]
    )
  ],  
  templateUrl: './interface-banner-image-form.component.html',
  styleUrls: ['./interface-banner-image-form.component.css']
})
export class InterfaceBannerImageFormComponent implements OnInit, OnDestroy {
  public bannerImage: BannerImage;
  public bannerImageBackup: BannerImage;
  public imageSrc: any;
  public doneLoadingContent: boolean = false;
  public animationState: string;
  public subscriptions: Subscription[] = [];
  constructor(
    public bannerImageService: BannerImageService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar
  ) { 
    this.animationState = "inactive";
    this.subscriptions.push(
      this.bannerImageService.getAll().filter(
        bannerImageArr => !!bannerImageArr
      ).subscribe(
        (bannerImageArr) => {
          if (bannerImageArr.length > 0) {
            this.bannerImage = bannerImageArr[0];
            this.bannerImageBackup = this.bannerImageService.new(
              this.bannerImage
            );
            this.imageSrc = this.bannerImage.image;
          } else {
            this.bannerImage = this.bannerImageService.new({
              image: '',
            });
            this.bannerImageBackup = this.bannerImageService.new(
              this.bannerImage
            );
          }
        },
        (err) => {
          this.bannerImage = this.bannerImageService.new({
            image: '',
          });
        }
      )
    )
  }

  @ViewChild('fileInput') fileInput: ElementRef;

  ngOnInit() {
  }

  cancelChanges() {
    const copy = this.bannerImageService.new(
      this.bannerImageBackup
    );
    if (this.bannerImage.image !== copy.image) {
      this.bannerImage.image = copy.image;
      this.imageSrc = copy.image;
      this.bannerImageService.initializeUploaderInstance();
    }
  }

  selectFileInput() {
    this.fileInput.nativeElement.click();
  }

  removeImage() {
    this.imageSrc = '';
    this.bannerImage.image = '';
    this.bannerImageService.initializeUploaderInstance();
  }

  handleBannerImageLoadDone(event: boolean) {
    this.doneLoadingContent = event;
    this.animationState = this.doneLoadingContent ? "active" : "inactive";
  }

  handleFileSelection(input: any) {
    console.log("input: ", input);
    if (input.files.length > 0) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let computedSrc: string = '';
        // sanitize the base64 encoded image because if you just
        // set [src] to the unsanitized base64 string, internally,
        // angular will attempt a regular expression match as well
        // as a sanitization which in some cases (not always) causes
        // a Maximum Call Stack Exceeded error. By sanitizing the string myself,
        // angular does not perform the sanitization + regexp match
        // internally when setting img [src], preventing the
        // Maximum Call Stack Size Exceeded error.
        this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
          e.target.result
        );
        this.bannerImage.image = 'base64img';
        //this.aboutForm.image = this.url;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  bannerImageFormSubmit() {
    this.animationState = "inactive";
    this.doneLoadingContent = false;
    if (this.bannerImage._id) {
      this.bannerImageService.update(
        this.bannerImage
      ).take(1).subscribe(
        (bannerImage) => {
          this.bannerImageBackup = this.bannerImageService.new(
            bannerImage
          );
          this.bannerImageService.uploadRequestInFlight = false;
          this.snackBar.open(
            "Banner image updated.", 
            "", 
            { duration: 3000}
          );
          if (this.imageSrc !== bannerImage.image && bannerImage.image) {
            this.animationState = "inactive";
            this.doneLoadingContent = false;
          } else {
            this.animationState = "active";
            this.doneLoadingContent = true;
          }
          this.imageSrc = bannerImage.image;
        }, 
        (err) => {
          console.error(err);
          this.animationState = "active";
        }
      )
    } else {
      this.bannerImageService.create(
        this.bannerImage
      ).take(1).subscribe(
        (bannerImages) => {
          this.bannerImageBackup = this.bannerImageService.new(
            bannerImages[0]
          );
          this.snackBar.open(
            "Banner image updated.",
            "",
            { duration: 3000 }
          );
          this.imageSrc = bannerImages[0].image;
        },
        (err) => {
          this.animationState = "inactive";
        }
      )
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => 
      subscription.unsubscribe()
    );
  }
}
