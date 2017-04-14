import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MdSnackBar } from '@angular/material';

import { About, AboutService } from '../about.index';
import { ContentLoadService } from '../../../../external_services/content-load/content-load.service';

@Component({
  selector: 'int-about-form',
  templateUrl: 'interface-about-form.component.html'
})
export class InterfaceAboutFormComponent implements OnInit {
  constructor(
    private _fb: FormBuilder,
    protected aboutService: AboutService,
    protected sanitizer: DomSanitizer,
    protected contentLoadService: ContentLoadService,
    private snackBar: MdSnackBar
  ) {
    this.aboutService.getAll().filter(aboutArr => !!aboutArr).subscribe(
      (aboutArray) => {
        if (aboutArray.length > 0) {
          this.aboutObj = aboutArray[0];
          this.aboutObjBackup = this.aboutService.new(this.aboutObj);
          if (!this.contentLoadService.contentBeingTracked()) {
            this.contentLoadService.setPostMap([this.aboutObj]);
            console.log("aboutArray: ", aboutArray);
            console.log('---');
            console.log(this.contentLoadService.postMapping);
            if (aboutArray[0].image === '') {
              this.contentLoadService.contentLoadingDone(aboutArray[0]);
            }
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
      this.contentLoadService.removeAllTrackedContent();
      this.contentLoadService.contentNeedsLoading(this.aboutObj);
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
    this.contentLoadService.contentLoadingDone(this.aboutObj);
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

    if (this.aboutObj._id) {
      this.aboutService.update(this.aboutObj).subscribe(
        (about) => {
          this.aboutObjBackup = this.aboutService.new(about);
          console.log("successful update: ", about);
          this.snackBar.open("About page updated.","", { duration: 3000 });
          //this.aboutObj = this.aboutService.new(about);
          this.imageSrc = about.image;
        },
        (err) => {
          console.error(err);
        }
      )
    } else {
      this.aboutService.create(this.aboutObj).subscribe(
        (about) => {
          this.aboutObjBackup = this.aboutService.new(about);
          console.log("successful creation: ", about);
          this.imageSrc = about[0].image;
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
