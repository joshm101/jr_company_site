import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { AppService } from '../../../app.service';
import { BannerImage } from './banner-image.model';
import { FileUploader } from 'ng2-file-upload';

@Injectable()
export class BannerImageService extends AppService<BannerImage> {
  private http: HttpClient;
  uploader: FileUploader;  

  constructor(
    injector: Injector
  ) {
    super(injector);
    this.http = injector.get(HttpClient);
    this.uploader = new FileUploader({
      url: "/api/bannerImage/upload"
    })
  }

  create(bannerImage: BannerImage): Observable<BannerImage[]> {
    this.requestInFlight = true;
    return super.create(
      bannerImage
    ).switchMap((returnedBannerImages: BannerImage[]) => {
      if (this.uploader.queue.length > 0) {
        this.uploadRequestInFlight = true;
        return this.uploadImage(
          this.newlyCreatedItem.imageId
        ).map((returnedBannerImageUpload: BannerImage) => {
          this.uploadRequestInFlight = false;
          this.requestInFlight = false;
          returnedBannerImages[0].image = returnedBannerImageUpload.image;
          return returnedBannerImages;
        })
      } else {
        this.requestInFlight = false;
        return Observable.of(returnedBannerImages);
      }
    });
  }

  getAll() {
    this.requestInFlight = true;
    return super.getAll().map((bannerImages: BannerImage[]) => {
      this.requestInFlight = false;
      return bannerImages;
    }); 
  }

  update(body: BannerImage): Observable<BannerImage> {
    this.requestInFlight = true;
    this.uploadRequestInFlight = true;
    return super.update(
      body
    ).switchMap((returnedBannerImage: BannerImage) => {
      if (this.uploader.queue.length > 0) {
        this.uploadRequestInFlight = true;
        return this.uploadImage(
          returnedBannerImage.imageId
        ).map(returnedBannerImageUpload => {
          this.uploadRequestInFlight = false;
          this.requestInFlight = false;
          if (returnedBannerImageUpload.image !== body.image) {
            return Object.assign(
              returnedBannerImage,
              {
                image: returnedBannerImageUpload.image
              }
            )
          } else {
            return returnedBannerImage;
          }
        });
      } else {
        this.requestInFlight = false;
        this.uploadRequestInFlight = false;
        return Observable.of(returnedBannerImage);
      }
    })
  }

  uploadImage(imageId: string): Observable<BannerImage> {
    let formData = new FormData();
    formData.append('imageid', imageId);
    let headers = new HttpHeaders({ 'Authorization': this._authService.token });
    let options = { headers: headers };
    this._uploadRequestInFlight = true;
    formData.append('fileUpload', this.uploader.queue[this.uploader.queue.length - 1]._file);
    return this.http.post(
      '/api/bannerImage/upload', 
      formData, 
      options
    ).map((res: BannerImage) => {
      this._uploadRequestInFlight = false;
      this.initializeUploaderInstance();
      return res;
    });
  }

  initializeUploaderInstance() {
    this.uploader = new FileUploader({
      url: ''
    });
  }

  public new (data?: any) {
    return new BannerImage(data);
  }

  protected getResource(): string {
    return 'bannerImage';
  }

}
