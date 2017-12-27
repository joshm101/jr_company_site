import { AppModel } from '../../../app.model';

export class BannerImage extends AppModel {
  constructor(data?: any) {
    super(data);
  }
  _id: string;
  imageId: string;
  image: string;
}
