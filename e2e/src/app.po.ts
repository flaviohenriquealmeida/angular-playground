import { browser } from 'protractor';

export class AppPage {

  navigateTo() {
      browser.get('/');
  }

  getWindowTitle() {
    return browser.getTitle();
  }
}
