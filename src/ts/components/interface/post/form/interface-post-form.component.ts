import { Component, ElementRef, OnInit, AfterViewInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';

import { EmbedPost, EmbedPostService } from '../../../embed-post/embed-post.index';
import { InputModeEnum } from '../../../../enums/input-mode.enum';

/**
 * This component acts as our main form
 * for posts on the interface
 *
 */
@Component({
  selector: 'int-post-form',
  templateUrl: 'ts/components/interface/post/form/interface-post-form.component.html'
})
export class InterfacePostFormComponent implements OnInit {
  constructor(
    protected embedPostService: EmbedPostService,
    protected elementRef: ElementRef,
    protected sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private _fb: FormBuilder
  ) {
    this.formHidden = true;
    this.doneClick = new EventEmitter<boolean>();
    this.uploader = this.embedPostService.getUploaderInstance();
    this.startLoad = new EventEmitter<boolean>();
    this.doneLoad = new EventEmitter<boolean>();
    this.doneLoadError = new EventEmitter<boolean>();
    this.route.params.filter(Boolean).subscribe(
      (params) => {
        this.contentType = params['contentType'];
      }
    )
  }



  @Input() focused: boolean;
  @Output() doneClick: EventEmitter<boolean>;
  @Output() startLoad: EventEmitter<boolean>;
  @Output() doneLoad: EventEmitter<boolean>;
  @Output() doneLoadError: EventEmitter<boolean>;
  @ViewChild('fileInput') fileInput: ElementRef;
  uploader: FileUploader;
  safeImages: any[];
  images: any[];

  handleFileSelection(input: any) {
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
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
        this.images.push(this.url);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  removeImage(i: number) {
    // set a timeout because the our focusedForm
    // directive checks if the click event occurred in an
    // element contained by the form. If we immediately
    // remove the image component, then the button that the
    // image component contains will disappear before
    // the directive registers the click event, so the
    // remove button will no longer technically
    // be contained by the form, which results
    // in the form being collapsed (undesired).
    setTimeout(() => {
      this.embedPostService.uploader.queue.splice(i, 1);
      this.images.splice(i, 1);
      if (i == this.addPostForm.value.thumbnailIndex) {
        this.addPostForm.value.thumbnailIndex = 0;
      }
      this.focused = true;
    }, 100);

  }

  setThumbnail(index: number) {
    this.addPostForm.value.thumbnailIndex = index;
  }

  selectFileInput() {
    this.fileInput.nativeElement.click();
  }

  doneClicked(event: Event) {
    event.stopPropagation();
    // set timeout to allow
    // for display of button ripple
    // animation
    setTimeout(() => {

      this.focused = false;
      this.doneClick.emit(true);
    }, 150);
  }

  // event handlers for
  // focusing & unfocusing
  // the form.
  focusCard() {
    this.formHidden = false;

  }

  unfocusCard() {
    this.cardFocus = false;
    this.formHidden = true;
  }

  // form submission handler
  addPostSubmit(event: Event) {
    this.currentHeight = this.elementRef.nativeElement.offsetHeight;
    this.isLoading = true;
    // prevent default form submission.
    // if the form errors out, we do not
    // want the default refresh action
    event.preventDefault();
    this.startLoad.emit();
    this.newEmbedPost = new EmbedPost({
      contentType: this.contentType
    });
    if (this.images.length === 1) this.addPostForm.value.thumbnailIndex = 0;

    Object.assign(
      this.newEmbedPost,
      {
        title: this.addPostForm.value.title,
        description: this.addPostForm.value.description,
        thumbnailIndex: this.addPostForm.value.thumbnailIndex
      }
    );
    this.newEmbedPost.embedContent = [];
    this.addPostForm.value.embedContent.forEach((item: any) =>
      this.newEmbedPost.embedContent.push(item.embedItem)
    );

    if (this.newEmbedPost.embedContent.length === 1 && this.newEmbedPost.embedContent[0] === '') {
      this.newEmbedPost.embedContent = [];
    }

    // Includes image uploading
    this.embedPostService.create(this.newEmbedPost).take(1).subscribe(
      (items: EmbedPost[]) => {
        this.initializeForm();
        this.embedPostService.initializeUploaderInstance();
      },
      (error) => {
        console.error(error);
        this.doneLoadError.emit(true);
        this.initializeForm();
        this.embedPostService.initializeUploaderInstance();

        // notify that an error has occurred
        // so that the interface can be properly
        // notified to handle the error accordingly
        this.embedPostService.notifyError();
        this.embedPostService.requestInFlight = false;
      }
    );

  }

  // embedContent is an array of iframes
  // so there can be an arbitrary number
  // of embed content fields in the
  // form. We begin by initializing
  // one embedContent field.
  initEmbedContent() {
    return this._fb.group({
      embedItem: ['']
    });
  }

  // add a new embed content field
  // to the form model
  addEmbedContent() {
    const control = <FormArray>this.addPostForm.controls['embedContent'];
    control.push(this.initEmbedContent());
  }

  // remove the specified embed
  // content field from the form
  // model (removing from the view form)
  removeEmbedContent(i: number, event: Event) {
    event.stopPropagation();
    const control = <FormArray>this.addPostForm.controls['embedContent'];
    control.removeAt(i);
  }

  ngOnInit() {
    this.initializeForm();
  }

  resetFileInput() {
    this.fileInput.nativeElement.value = '';
    if (this.fileInput.nativeElement.value) {
      this.fileInput.nativeElement.type = 'text';
      this.fileInput.nativeElement.type = 'file';
    }
  }

  initializeForm() {
    this.images = [];
    this.safeImages = [];
    this.showFiller = true;
    this.embedPostService.initializeUploaderInstance();
    this.uploader = this.embedPostService.uploader;
    this.resetFileInput();
    // initialize the form
    this.addPostForm = this._fb.group({
      title: ['', [Validators.required]],
      description: [''],
      embedContent: this._fb.array([
        this.initEmbedContent()
      ]),
      thumbnailIndex: [0]
    });
  }

  addPostForm: FormGroup;
  formHidden: boolean = true;
  imageButtonFocus: boolean = false;
  cardFocus: boolean = false;
  titleFocus: boolean = false;
  descFocus: boolean = false;
  newEmbedPost: EmbedPost;
  inputMode = InputModeEnum;
  showFiller: boolean;
  thumbnailIndex: number = 0;
  url: any;
  isLoading: boolean;
  currentHeight: number;
  contentType: number;
}
