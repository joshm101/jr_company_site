import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MdSnackBar } from '@angular/material';

import { About, AboutService } from '../about.index';
import { ContentLoadService } from '../../../../external_services/content-load/content-load-service';

@Component({
  selector: 'int-about-form',
  templateUrl: 'ts/components/interface/about/form/interface-about-form.component.html'
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
          /*
          // should only ever be 1 about item, if
          // any exist
          let temp = this.aboutService.new(aboutArray[0]);
          console.log("emit******************");
          if (!this.aboutObj || (this.aboutObj.image !== aboutArray[0].image)) {
            this.contentLoadService.contentNeedsLoading(aboutArray[0]);
          }

          // no image to load, allow doneload emission from service
          if (!this.aboutService.requestInFlight && this.aboutObj.image === '') {
            this.contentLoadService.contentLoadingDone(this.aboutObj);
          }*/

          this.aboutObj = aboutArray[0];
          this.aboutObjBackup = this.aboutService.new(this.aboutObj);
          if (!this.contentLoadService.contentBeingTracked()) {
            this.contentLoadService.setPostMap(aboutArray);
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
