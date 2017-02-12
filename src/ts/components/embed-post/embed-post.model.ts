import { SafeHtml } from '@angular/platform-browser'

import { AppModel } from '../app.model';

export class EmbedPost extends AppModel {
  constructor(data?: any) {
    super(data);
  }
  public title: string;
  public description: string;
  public embedContent: string[];

  // THIS FIELD MUST BE DELETED ON SUBMISSION
  public embedContentSafe: SafeHtml[];
  public created: Date;
  public edited: Date;
  public imagesId:  string;
  public images: string[];
  public thumbnailIndex: number;
  public contentType: number;
  public _id: string;
}
