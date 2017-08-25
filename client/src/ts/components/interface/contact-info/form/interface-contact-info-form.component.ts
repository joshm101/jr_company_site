import { Component } from '@angular/core';
import { FormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MdSnackBar } from '@angular/material';

import { ContactInfo, ContactInfoService } from '../contact-info.index';

@Component({
  selector: 'int-contact-info-form',
  templateUrl: 'interface-contact-info-form.component.html'
})
export class InterfaceContactInfoFormComponent {
  contactInfoForm: FormGroup;
  contactInfoObj: ContactInfo;

  // in case changes are cancelled
  contactInfoObjBackup: ContactInfo;
  constructor(
    private _fb: FormBuilder,
    protected contactInfoService: ContactInfoService,
    private snackBar: MdSnackBar,
  ) {
    this.contactInfoService.getAll().filter(contactInfoArr => !!contactInfoArr).subscribe(
      (contactInfoArr) => {
        if (contactInfoArr.length > 0) {
          this.contactInfoObj = contactInfoArr[0];
          this.contactInfoObjBackup = this.contactInfoService.new(this.contactInfoObj);
        } else {
          // haven't configured contact info before
          this.contactInfoObj = this.contactInfoService.new({
            alias: '',
            email: '',
            facebookUrl: '',
            instagramUrl: '',
            soundcloudUrl: '',
            twitterUrl: '',
          });
          this.contactInfoObjBackup = Object.assign(
            {},
            this.contactInfoObj
          );
        }
        this.initializeForm();
      }
    )
  }

  initializeForm() {
    this.contactInfoForm = this._fb.group({
      alias: [this.contactInfoObj.alias],
      email: [this.contactInfoObj.email],
      facebookUrl: [this.contactInfoObj.facebookUrl],
      instagramUrl: [this.contactInfoObj.instagramUrl],
      soundcloudUrl: [this.contactInfoObj.soundcloudUrl],
      twitterUrl: [this.contactInfoObj.twitterUrl],
    });
  }

  cancelChanges() {
    let copy = this.contactInfoService.new(this.contactInfoObjBackup);
    Object.assign(
      this.contactInfoObj,
      copy
    );
    this.initializeForm();
  }

  contactInfoFormSubmit() {
    this.contactInfoObj.alias = this.contactInfoForm.value.alias;
    this.contactInfoObj.email= this.contactInfoForm.value.email;
    this.contactInfoObj.soundcloudUrl = this.contactInfoForm.value.soundcloudUrl;
    this.contactInfoObj.facebookUrl = this.contactInfoForm.value.facebookUrl;
    this.contactInfoObj.instagramUrl = this.contactInfoForm.value.instagramUrl;
    this.contactInfoObj.twitterUrl = this.contactInfoForm.value.twitterUrl;
    if (this.contactInfoObj._id) {
      this.contactInfoService.update(this.contactInfoObj).take(1).subscribe(
        (contactInfo) => {
          this.contactInfoObjBackup = this.contactInfoService.new(contactInfo);
          this.snackBar.open("Contact info updated.", "", { duration: 3000 });
        },
        (err) => {
          console.error(err);
        }
      );
    } else {
      this.contactInfoService.create(this.contactInfoObj).take(1).subscribe(
        (contactInfo) => {
          this.contactInfoObjBackup = this.contactInfoService.new(contactInfo);
          this.snackBar.open("Contact info updated.", "", { duration: 3000 });
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }
}
