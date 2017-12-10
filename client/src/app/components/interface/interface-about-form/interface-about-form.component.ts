import { Component, ViewChild, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { FormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material';

import { About, AboutService } from '../interface-about-content/about.index';

@Component({
  selector: 'app-interface-about-form',
  templateUrl: './interface-about-form.component.html',
  styleUrls: ['./interface-about-form.component.css']
})
export class InterfaceAboutFormComponent implements OnInit {
  @Output()
  public doneLoading: EventEmitter<boolean>;
  constructor(
    private _fb: FormBuilder,
    protected aboutService: AboutService,
    protected sanitizer: DomSanitizer,
    private snackBar: MatSnackBar
  ) {
    this.doneLoading = new EventEmitter<boolean>();
    this.doneLoading.emit(false);
    this.aboutService.getAll().filter(aboutArr => !!aboutArr).subscribe(
      (aboutArray) => {
        if (aboutArray.length > 0) {
          this.aboutObj = aboutArray[0];
          this.aboutObjBackup = this.aboutService.new(this.aboutObj);
          if (this.aboutObj._id) {
            console.log("aboutArray: ", aboutArray);
            console.log('---');
          }
        } else {
          // haven't configured about page before
          this.aboutObj = this.aboutService.new({
            header: '',
            description: ''
          });
        }
        this.initializeForm();
        console.log("this.aboutObj: ", this.aboutObj);
      },
      (err) => {
        this.aboutObj = this.aboutService.new({
          header: '',
          description: ''
        });
        this.initializeForm();
      }
    )
  }

  @ViewChild('fileInput') fileInput: ElementRef;

  ngOnInit() {

  }

  cancelChanges() {
    let copy = this.aboutService.new(this.aboutObjBackup);
    this.aboutObj.header = copy.header;
    this.aboutObj.description = copy.description;
    if (this.aboutObj.image !== copy.image) {
      this.aboutObj.image = copy.image;
      this.aboutService.initializeUploaderInstance();
    }
    this.initializeForm();
  }

  initializeForm() {
    this.aboutForm = this._fb.group({
      header: [this.aboutObj.header],
      description: [this.aboutObj.description]
    });
    this.imageSrc = this.aboutObj.image || '';
  }

  selectFileInput() {
    this.fileInput.nativeElement.click();
  }

  removeImage() {
    console.log("remove image");
    this.imageSrc = '';
    this.aboutObj.image = '';
    this.aboutService.initializeUploaderInstance();
  }

  handleAboutImageLoadDone(event: boolean) {
    console.log("done loading: ", event);
    this.doneLoading.emit(true);
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
        this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
        this.aboutObj.image = '';
        //this.aboutForm.image = this.url;
      };
      reader.readAsDataURL(input.files[0]);
    }

  }

  aboutFormSubmit() {
    console.log("submit about form");
    console.log("this.aboutForm: ", this.aboutForm);
    this.aboutObj.header = this.aboutForm.value.header;
    this.aboutObj.description = this.aboutForm.value.description;
    console.log("this.aboutObj on submit: ", this.aboutObj);
    this.doneLoading.emit(false);
    if (this.aboutObj._id) {
      this.aboutService.update(this.aboutObj).take(1).subscribe(
        (about) => {
          this.aboutObjBackup = this.aboutService.new(about);
          console.log("successful update: ", about);
          this.snackBar.open("About page updated.","", { duration: 3000 });
          //this.aboutObj = this.aboutService.new(about);
          if (this.imageSrc === about.image) {
            this.doneLoading.emit(true);
          }
          this.imageSrc = about.image;
        },
        (err) => {
          console.error(err);
        }
      )
    } else {
      this.aboutService.create(this.aboutObj).take(1).subscribe(
        (about) => {
          this.aboutObjBackup = this.aboutService.new(about);
          console.log("successful creation: ", about);
          this.snackBar.open("About page updated.","", { duration: 3000 });
          this.imageSrc = about[0].image;
          if (!this.imageSrc || this.imageSrc === "") {
            this.doneLoading.emit(true);
          }
        },
        (err) => {
          console.error(err);
        }
      )
    }
  }

  imageSrc: any;
  aboutForm: FormGroup;
  aboutObj: About;

  // in case changes are cancelled.
  aboutObjBackup: About;

}
