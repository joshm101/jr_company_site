import { AppModel } from '../../app.model';

export class About extends AppModel {
  constructor(data?: any) {
    super(data);
  }
  id: string;
  imageId: string;
  image: string;
  header: string;
  description: string;
}
