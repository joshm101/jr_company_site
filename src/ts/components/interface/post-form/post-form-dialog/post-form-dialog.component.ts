import { Component, ElementRef, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { MdDialogRef } from '@angular/material';
import { EmbedPost, EmbedPostService } from '../../../embed-post/embed-post.index';

import { InputModeEnum } from '../../../../enums/input-mode.enum';

/**
 * This component acts as our main form
 * for posts on the interface
 *
 */
@Component({
  selector: 'post-form-dialog',
  templateUrl: 'ts/components/interface/post-form/post-form-dialog/post-form-dialog.component.html'
})
export class PostFormDialogComponent implements OnInit {
  constructor(
    protected embedPostService: EmbedPostService,
    protected elementRef: ElementRef,
    private _fb: FormBuilder,
    public dialogRef: MdDialogRef<PostFormDialogComponent>
  ) {
    this.formHidden = true;
    this.doneClick = new EventEmitter<boolean>();
  }

  @Input() focused: boolean = true;

  @Output() doneClick: EventEmitter<boolean>;

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

    // prevent default form submission.
    // if the form errors out, we do not
    // want the default refresh action
    event.preventDefault();
    this.newEmbedPost = new EmbedPost();

    Object.assign(
      this.newEmbedPost,
      {
        title: this.addPostForm.value.title,
        description: this.addPostForm.value.description
      }
    );
    this.newEmbedPost.embedContent = [];
    this.addPostForm.value.embedContent.forEach((item: any) =>
      this.newEmbedPost.embedContent.push(item.embedItem)
    );

    this.embedPostService.create(this.newEmbedPost).take(1).subscribe(
      (items) => {} ,
      (error) => {
        console.error(error);
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

    // initialize the form
    this.addPostForm = this._fb.group({
      title: ['', [Validators.required]],
      description: [''],
      embedContent: this._fb.array([
        this.initEmbedContent()
      ])
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
}
