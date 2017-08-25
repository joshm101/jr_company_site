import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { AppService } from '../../app.service';
import { ContactInfo} from './contact-info.model';

@Injectable()
export class ContactInfoService extends AppService<ContactInfo> {

  public new(data?: any) {
    return new ContactInfo(data);
  }

  protected getResource(): string {
    return 'contactInfo';
  }
}
