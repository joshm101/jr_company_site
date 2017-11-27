import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';

import { EmbedPost } from './embed-post.model';
import { AppService } from '../../app.service';
import { FileUploader } from 'ng2-file-upload';
import { ContentLoadService } from '../../external-services/content-load/content-load.service';

@Injectable()
export class EmbedPostService extends AppService<EmbedPost> {
  private http: HttpClient;
  public currentPageArbiter: BehaviorSubject<number>;
  public currentPage$: Observable<number>;
  private _itemsPerPage: number = 4;
  public uploader: FileUploader;
  constructor(
    protected sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private contentLoadService: ContentLoadService,
    injector: Injector
  ) {
    super(injector);
    this.uploader = new FileUploader({
      url: "/api/embed-post/upload"
    });
    this.http = injector.get(HttpClient);
    this._requestInFlight = false;
    this.editErrorArbiter = new Subject<boolean>();
    this.currentPageArbiter = new BehaviorSubject<number>(1);
    this.editErrorOccurred$ = this.editErrorArbiter.asObservable();
    this.currentPage$ = this.currentPageArbiter.asObservable();
    this.editErrorArbiter.next(false);
    this._uploadRequestInFlight = false;
  }

  public new(data?: any) {
    return new EmbedPost(data);
  }

  getAll(options: any = {}): Observable<EmbedPost[]> {
    this._requestInFlight = true;
    return this.currentPage$.switchMap(currentPage => {
      const requestOptions = {
        params: [
          {
            key: 'page',
            value: currentPage
          },
          {
            key: 'limit',
            value: this.itemsPerPage,
          }
        ].concat(options.params || [])
      };
      return super.getAll(requestOptions).map((posts: EmbedPost[]) => {
        if (this.contentType || this.contentType === 0) {
          return posts.filter(post => post.contentType === this.contentType);
        } else {
          return posts;
        }
      }).map(posts => {
        this._requestInFlight = false;
        posts.forEach((post) => {
          post.embedContentSafe = [];
        });
        posts.forEach(post => this.createSafeHtml(post));
        return posts;
      })      
    });
  }

  update(body: EmbedPost): Observable<EmbedPost> {
    this.requestInFlight = true;
    return super.update(body).switchMap((post: EmbedPost) => {
      // Mark all of the iframes as safe html
      this.createSafeHtml(post);
      //this.contentLoadService.contentNeedsLoading(post);
      if (this.uploader.queue.length > 0) {
        this.uploadRequestInFlight = true;
        return this.uploadImages(post.imagesId)
          .map(returnedPost => {
            this.requestInFlight = false;
            this.uploadRequestInFlight = false;
            return Object.assign(
                post,
                {
                  images: returnedPost.images
                }
              );
          });
      } else {
        // this.contentLoadService.contentNeedsLoading(post);
        this._requestInFlight = false;
        return Observable.of(post);
      }
    });
  }

  create(post: EmbedPost): Observable<EmbedPost[]> {
    this.requestInFlight = true;
    // our service super class handles almost all of the
    // creation logic, but EmbedPosts in particular have
    // the field embedContent which is an array of iframes.
    // These iframes need to be marked safe by Angular.
    return super.create(post).switchMap((posts: EmbedPost[]) => {
      let i = posts.length - 1;
      let post: EmbedPost = posts[i];
      this.contentLoadService.contentNeedsLoading(post);

      // Mark all of the iframes as safe html
      this.createSafeHtml(post);

      // create form to upload images associated with
      // posts (if any were selected).
      // Uploading happens after the post is created
      // and saved to the DB so that we at least have
      // a reference to the post in case the uploading
      // fails.
      if (this.uploader.queue.length > 0) {
        this.uploadRequestInFlight = true;
        return this.uploadImages(
          this.newlyCreatedItem.imagesId
        ).map((returnedPost: EmbedPost): EmbedPost[] => {
          posts.forEach(post => {
            this._requestInFlight = false;
            if (post.imagesId === returnedPost.imagesId) {
              // update the recently created post's images
              // array to contain the paths of images uploaded
              // for the post
              post.images = returnedPost.images;
            }
          });
          this.uploadRequestInFlight = false;
          this.requestInFlight = false;
          return posts;
        });
      } else {
        this.requestInFlight = false;
        // no images uploaded.
        return Observable.of(posts);
      }
    });
  }

  delete(id: string): Observable<EmbedPost> {
    return super.delete(id).map(result =>{
      return result;
    });
  }

  uploadImages(imagesId: string): Observable<EmbedPost> {
    let formData = new FormData();
    formData.append('imagesid', imagesId);
    let headers = new HttpHeaders({ 'Authorization': this._authService.token });
    let options = { headers: headers };
    this.uploader.queue.forEach(queueItem => formData.append('fileUpload', queueItem._file));
    return this.http.post('/api/embedPosts/upload', formData, options).filter(res => !!res).take(1)
      .map((res: EmbedPost) => {
        this.initializeUploaderInstance();
        return res;
      });
  }

  incrementPage() {
    let currentPage = this.currentPageArbiter.value;
    this.currentPageArbiter.next(++currentPage);
  }

  decrementPage() {
    let currentPage = this.currentPageArbiter.value;
    this.currentPageArbiter.next(--currentPage || 1);
  }

  setPage(page: number) {
    this.currentPageArbiter.next(page || 1);
  }

  get currentPage() {
    return this.currentPageArbiter.value;
  }

  get itemsPerPage() {
    return this._itemsPerPage;
  }
  
  set itemsPerPage(numItems: number) {
    this._itemsPerPage = numItems || 4;
  }

  getUploaderInstance() {
    return this.uploader;
  }

  initializeUploaderInstance() {
    this.uploader = new FileUploader({
      url: "api/embedPosts/upload"
    });
  }

  // Marks each embedded item
  // of a post as trusted so Angular
  // will render the iframe in the
  // view
  createSafeHtml(post: EmbedPost) {
    post.embedContentSafe = [];
    if (post.embedContent) {
      post.embedContent.forEach(iframe =>
        post.embedContentSafe.push(this.sanitizer.bypassSecurityTrustHtml(iframe))
      );
    }
  }

  protected getResource(): string {
    return 'embedPosts';
  }

  set contentType(val: number) {
    this._contentType = val;
  }

  get contentType() {
    return this._contentType;
  }

  notifyError() {
    this.editErrorArbiter.next(true);
    this.editErrorArbiter.next(false);
  }

  editErrorOccurred$: Observable<boolean>;
  private editErrorArbiter: Subject<boolean>;
  private _contentType:  number;

}
