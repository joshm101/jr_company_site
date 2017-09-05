import { Component, ElementRef, OnInit, Input, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { MdButton, MdSnackBar } from '@angular/material';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { Observable, Subscription } from 'rxjs/Rx';

import { EmbedPost, EmbedPostService } from '../../../embed-post/embed-post.index';
import { InputModeEnum } from '../../../../enums/input-mode.enum';
import { ContentLoadService } from '../../../../external-services/content-load/content-load.service';

@Component({
  selector: 'app-interface-post-form-dialog',
  templateUrl: './interface-post-form-dialog.component.html',
  styleUrls: ['./interface-post-form-dialog.component.css']
})
export class InterfacePostFormDialogComponent implements OnInit, OnDestroy {
  constructor(
    protected embedPostService: EmbedPostService,
    protected elementRef: ElementRef,
    protected sanitizer: DomSanitizer,
    private _fb: FormBuilder,
    private contentLoadService: ContentLoadService,
    private snackBar: MdSnackBar
  ) {
    this.formHidden = true;
    this.subscriptions = [];
    this.doneClick = new EventEmitter<boolean>();
    this.embedPostService.initializeUploaderInstance();
    this.uploader = this.embedPostService.getUploaderInstance();
  }

  @Input() focused: boolean;
  @Output() doneClick: EventEmitter<boolean>;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('close') close: MdButton;
  uploader: FileUploader;
  safeImages: any[];
  images: any[];

  ngOnInit() {
    this.images = [];
    this.safeImages = [];
    this.contentLoadService.removeContentToTrack(this.postToEdit);
    this.embedPostEdit = this.embedPostService.new(this.postToEdit);
    console.log(this.embedPostEdit);
    if (!this.embedPostEdit.embedContent) {
      this.embedPostEdit.embedContent = [];
    }
    // Form initialization

    // Populate the form fields for array of iframe strings
    this.embedContentFormArray = this._fb.array([]);
    this.embedPostEdit.embedContent.forEach((content: string, index: number) => {
      this.embedContentFormArray.controls.push(
        new FormControl(this.embedPostEdit.embedContent[index])
      );
    });

    // initialize the form model with preexisting values
    this.addPostForm = this._fb.group({
      title: [this.embedPostEdit.title, [Validators.required]],
      description: [this.embedPostEdit.description],
      embedContent: this.embedContentFormArray,
      thumbnailIndex: [this.embedPostEdit.thumbnailIndex]
    });

    // set the images for the post to edit for viewing.
    this.embedPostEdit.images.forEach((image: string) => {
      this.images.push((' ' + image).slice(1));
    });
  }

  handleFileSelection(input: any) {
    if (input.files.length > 0) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.url = e.target.result;
        this.images.push(this.url);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  removeImage(i: number) {
    // set a timeout because the focusedForm
    // directive checks if the click event occurred in an
    // element contained by the form. If we immediately
    // remove the image component, then the button that the
    // image component contains will disappear before
    // the directive registers the click event, so the
    // remove button will no longer technically
    // be contained by the form, which results
    // in the form being collapsed (undesired).
    setTimeout(() => {

      // if the index is greater than the current
      // post's saved images length, then we
      // are removing an image that has not yet
      // been uploaded, so we want to make sure
      // we remove it from the upload queue
      if (i >= this.embedPostEdit.images.length) {

        // remove at offset.
        this.embedPostService.uploader.queue.splice(i - this.embedPostEdit.images.length, 1);
      }
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
  updatePostSubmit(event: Event) {
    let regex = /data:/;
    // prevent default form submission.
    // if the form errors out, we do not
    // want the default refresh action
    event.preventDefault();
    if (this.images.length === 1) this.addPostForm.value.thumbnailIndex = 0;

    // extract information from our form model
    this.embedPostEdit.title = this.addPostForm.value.title;
    this.embedPostEdit.description = this.addPostForm.value.description;
    this.embedPostEdit.thumbnailIndex = this.addPostForm.value.thumbnailIndex;
    if (!this.images[this.embedPostEdit.thumbnailIndex]) {
      this.embedPostEdit.thumbnailIndex = 0;
    }
    this.embedPostEdit.embedContent = [];
    this.addPostForm.value.embedContent.forEach((item: string) => {
      // don't save empty fields
      if (item !== undefined && item !== '') {
        this.embedPostEdit.embedContent.push(item)
      }
    });
    this.embedPostEdit.images = this.images.filter(image => !regex.test(image));
    this.embedPostService.requestInFlight = true;
    this.close._getHostElement().click();
    // Includes image uploading
    //this.subscriptions.push(
      this.embedPostService.update(this.embedPostEdit).filter(res => !!res).take(1).subscribe(
        (item: EmbedPost) => {
          this.contentLoadService.contentNeedsLoading(item);
        },
        (error) => {
          this.snackBar.open("Error. Check your connection & try again.", "", { duration: 5000 });
          console.error(error);

          // notify that an error has occurred
          // so that the interface can be properly
          // notified to handle the error accordingly
          this.embedPostService.notifyError();
          this.embedPostService.requestInFlight = false;
        }
      )
    //);

  }

  // embedContent is an array of iframes
  // so there can be an arbitrary number
  // of embed content fields in the
  // form. We begin by initializing
  // one embedContent field.
  initEmbedContent(val?: string) {
    return new FormGroup({
      'embedItem': new FormControl(val)
    });
  }

  // add a new embed content field
  // to the form model
  addEmbedContent() {
    const control = <FormArray>this.addPostForm.controls['embedContent'];
    control.push(new FormControl(''));
  }

  // remove the specified embed
  // content field from the form
  // model (removing from the view form)
  removeEmbedContent(i: number, event: Event) {
    event.stopPropagation();
    const control = <FormArray>this.addPostForm.controls['embedContent'];
    control.removeAt(i);
  }

  addPostForm: FormGroup;
  formHidden: boolean = true;
  imageButtonFocus: boolean = false;
  cardFocus: boolean = false;
  titleFocus: boolean = false;
  descFocus: boolean = false;
  postToEdit: EmbedPost;
  embedPostEdit: EmbedPost;
  embedContentFormArray: FormArray;
  inputMode = InputModeEnum;
  thumbnailIndex: number = 0;
  url: any;
  subscriptions: Subscription[];
  public i: number;

  ngOnDestroy() {
    console.log('undefined?');
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

}
