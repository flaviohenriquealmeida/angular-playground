import { browser, element, by } from 'protractor';
import path = require('path');

export class PhotoFormPage {

  navigateTo() {
      browser.get('/');
  }

  clickUploadButton() {
      element(by.className('fa-plus-circle')).click();
  }

  getWindowTitle() {
    return browser.getTitle();
  }

  fillForm() {
    const fileToUpload = 'file-to-upload.jpg';
    const absolutePath = path.resolve(__dirname, fileToUpload);
    element(by.css('[formControlName=file]')).sendKeys(absolutePath);
    element(by.css('[formControlName=description]')).sendKeys('Upload test');
    element(by.css('[type=submit]')).click();
    browser.sleep(3000);
  }
}
