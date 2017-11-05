import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material';

import { BannerImage, BannerImageService } from '../interface-banner-image-content/banner-image.index';
import { ContentLoadService } from '../../../external-services/content-load/content-load.service';

@Component({
  selector: 'app-interface-banner-image-form',
  templateUrl: './interface-banner-image-form.component.html',
  styleUrls: ['./interface-banner-image-form.component.css']
})
export class InterfaceBannerImageFormComponent implements OnInit {
  public bannerImage: BannerImage;
  public bannerImageBackup: BannerImage;
  public imageSrc: any;
  constructor(
    public bannerImageService: BannerImageService,
    private sanitizer: DomSanitizer,
    private contentLoadService: ContentLoadService,
    private snackBar: MatSnackBar
  ) { 
    this.bannerImageService.getAll().filter(
      bannerImageArr => !!bannerImageArr
    ).subscribe(
      (bannerImageArr) => {
        if (bannerImageArr.length > 0) {
          this.bannerImage = bannerImageArr[0];
          this.bannerImageBackup = this.bannerImageService.new(
            this.bannerImage
          );
          // if (!this.contentLoadService.contentBeingTracked()) {
          //   this.contentLoadService.setPostMap(
          //     [this.bannerImage]
          //   );
          //   if (this.bannerImage.image === '') {
          //     this.contentLoadService.contentLoadingDone(
          //       bannerImageArr[0]
          //     );
          //   }
          // }
          this.imageSrc = this.bannerImage.image;
        } else {
          this.bannerImage = this.bannerImageService.new({
            image: '',
          });
          this.contentLoadService.contentNeedsLoading(
            this.bannerImage
          );
          this.contentLoadService.contentLoadingDone(
            this.bannerImage
          );
          this.bannerImageBackup = this.bannerImageService.new(
            this.bannerImage
          );
        }
      },
      (err) => {
        this.bannerImage = this.bannerImageService.new({
          image: '',
        });
        this.contentLoadService.contentNeedsLoading(
          this.bannerImage
        );
        this.contentLoadService.contentLoadingDone(
          this.bannerImage
        );
      }
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
      this.contentLoadService.removeAllTrackedContent();
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
    this.contentLoadService.contentLoadingDone(
      this.bannerImage
    );
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
    if (this.bannerImage._id) {
      this.bannerImageService.update(
        this.bannerImage
      ).take(1).subscribe(
        (bannerImage) => {
          this.bannerImageBackup = this.bannerImageService.new(
            bannerImage
          );
          this.snackBar.open(
            "Banner image updated.", 
            "", 
            { duration: 3000}
          );
          this.imageSrc = bannerImage.image;
        }, 
        (err) => {
          console.error(err);
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
        }
      )
    }
  }
}
