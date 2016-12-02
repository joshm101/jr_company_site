import { SafeHtml } from '@angular/platform-browser'

export class EmbedPost {
  public title: string;
  public description: string;
  public embedContent: string[];

  // THIS FIELD MUST BE DELETED ON SUBMISSION
  public embedContentSafe: SafeHtml[];
  public created: Date;
  public edited: Date;
  public _id: number;
}
