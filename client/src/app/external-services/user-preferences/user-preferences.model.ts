export class UserPreferences {
  constructor(data?: any) {
    Object.assign(this, data);
  }
  public _id: string;
  public userId: string;
  public itemsPerPage: number;
}