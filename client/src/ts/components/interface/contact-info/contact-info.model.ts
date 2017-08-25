import { AppModel } from '../../app.model';

export class ContactInfo extends AppModel {
  constructor(data?: any) {
    super(data);
  }
  _id: string;
  alias: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  soundcloudUrl: string;
  twitterUrl: string;
}
