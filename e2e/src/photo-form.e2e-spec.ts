import { PhotoFormPage } from './photo-form.po';

describe('PhotoFormComponent', () => {

  let page: PhotoFormPage;
  let previousTotal = 0;

  beforeEach(async () => {
    page = new PhotoFormPage();
  });
  
  it('Should be on upload page', async () => {
    page.navigateTo();
    page.clickUploadButton();
    const title = await page.getWindowTitle();
    expect(title).toEqual('Photo upload');
  });

  it('should upload and return to Timeline showing new photo', async () => {
    page.fillForm();
    const title = await page.getWindowTitle();
    expect(title).toEqual('Timeline');
  });
});