import { JrCompanySitePage } from './app.po.ts';

describe('jr-company-site App', function() {
  let page: JrCompanySitePage;

  beforeEach(() => {
    page = new JrCompanySitePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
