import { AppPage } from './app.po';

describe('AppComponent', () => {

  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });
  
  it('Should be at Timeline if logged', async () => {
    page.navigateTo();
    const title = await page.getWindowTitle();
    expect(title).toEqual('Timeline');
  });
});
