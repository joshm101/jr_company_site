import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiService } from '../../../api.service';
import { InstagramAuthResponseCodeEnum } from '../../../enums/instagram-auth-response-code.enum';

@Injectable()
export class InstagramAuthService {

  constructor(
    private api: ApiService
  ) { }

  obtainAccessToken(code: string) {
    return this.api.post(
      'api/instagramFeed/request_access_token',
      {
        code
      }
    ).map((res) => {
      return {
        success: true
      };
    }).catch(errResponse => {
      const errorMessage = this.constructErrorMessage(
        errResponse.error.error
      );
      throw new Error(errorMessage);
    })
  }

  constructErrorMessage(errorCode: number) {
    const tryAgainString = this.tryAgainString;
    switch (errorCode) {
      case InstagramAuthResponseCodeEnum.CODE_UNDEFINED:
        return `No code was given. ${tryAgainString}`
      case InstagramAuthResponseCodeEnum.ACCESS_TOKEN_RETRIEVAL_ERROR:
        return (
          `Unable to retrieve an access token from ` +
          `Instagram's servers using the given code.  
          ${tryAgainString}`
        );
      case InstagramAuthResponseCodeEnum.SAVE_TO_DB_ERROR:
        return (
          `The access token was successfully retrieved from ` +
          `Instagram's servers, however, there was an error ` + 
          `while saving the access token to the database. 
          ${tryAgainString}`
        );
      default:
        return '';
    }
  }

  get tryAgainString() {
    return (
      `Please visit http://jruttenberg.io/settings ` +
      `and retry this process. 
      If this keeps happening, please contact this ` + 
      `site's most recent developer.`
    );
  }

}
