import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { AppService } from '../../app.service';
import { About } from './about.model';
import { FileUploader } from 'ng2-file-upload';
import { ContentLoadService } from '../../../external_services/content-load/content-load-service';

@Injectable()
export class AboutService extends AppService<About> {
  constructor(
    http: Http,
    private contentLoadService: ContentLoadService
  ) {
    super(http);
    this.uploader = new FileUploader({
      url: "http://localhost:3000/api/about/upload"
    });
  }

  getAll() {
    this._requestInFlight = true;
    return super.getAll().map((about: About[]) => {
      this._requestInFlight = false;
      return about;
    });
  }

  update(body: About): Observable<About> {
    this._requestInFlight = true;
    return super.update(body).switchMap((returnedAbout: About) => {
      if (this.uploader.queue.length > 0) {
        this.contentLoadService.contentNeedsLoading(returnedAbout);
        this.uploadRequestInFlight = true;
        return this.uploadImage(returnedAbout.imageId)
          .map(returnedAboutUpload => {
            this.uploadRequestInFlight = false;
            console.log("returnedAboutUpload: ", returnedAboutUpload);
            this._requestInFlight = false;

            // if an image was uploaded, update
            // the image url.
            if (returnedAboutUpload.image !== body.image) {
              return Object.assign(
                returnedAbout,
                {
                  image: returnedAboutUpload.image
                }
              );
            } else {
              return returnedAbout;
            }
          });
      } else {
        if (returnedAbout.image === '') {
          this.contentLoadService.removeAllTrackedContent();
        }
        this._requestInFlight = false;
        return Observable.of(returnedAbout);
      }
    });
  }

  create(about: About): Observable<About[]> {
    this._requestInFlight = true;
    return super.create(about).switchMap((returnedAbout: About[]) => {
      this.contentLoadService.contentNeedsLoading(returnedAbout[0]);
      if (this.uploader.queue.length > 0) {
        this.uploadRequestInFlight = true;
        return this.uploadImage(this.newlyCreatedItem.imageId)
          .map((returnedAboutUpload: About) => {
            this.uploadRequestInFlight = false;
            this._requestInFlight = false;
            returnedAbout[0].image = returnedAboutUpload.image;
            return returnedAbout;
          })
      } else {
        this._requestInFlight = false;
        return Observable.of(returnedAbout);
      }
    });
  }

  uploadImage(imageId: string): Observable<About> {
    let formData = new FormData();
    formData.append('imagesid', imageId);
    this._uploadRequestInFlight = true;
    formData.append('fileUpload', this.uploader.queue[this.uploader.queue.length - 1]._file);
    //this.uploader.queue.forEach(queueItem => formData.append('fileUpload', queueItem._file));
    return this.http.post('/api/about/upload', formData)
      .map(res => {
        this._uploadRequestInFlight = false;
        this.initializeUploaderInstance();
        return res.json();
      });
  }

  initializeUploaderInstance() {
    this.uploader = new FileUploader({
      url: "http://localhost:3000/api/about/upload"
    });
  }

  uploader: FileUploader;

  public new(data?: any) {
    return new About(data);
  }

  protected getResource(): string {
    return 'about';
  }
}
