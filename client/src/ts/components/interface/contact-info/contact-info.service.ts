import { Injectable, Injector } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { AppService } from '../../app.service';
import { ContactInfo} from './contact-info.model';

@Injectable()
export class ContactInfoService extends AppService<ContactInfo> {
  constructor(
    private _http: Http,
    private _injector: Injector,
  ) {
    super(_http, _injector);
  }
  public new(data?: any) {
    return new ContactInfo(data);
  }

  protected getResource(): string {
    return 'contactInfo';
  }
}
