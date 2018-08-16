import { browser, element, by } from 'protractor';
import { elementAttribute } from '@angular/core/src/render3/instructions';

export class PhotoDetailPage {

    navigateTo() {
        browser.get('/');
    }

    clickToRemove() {
        const button = element(by.css('.fa-trash-o'));
        browser.actions().mouseMove(button).click().perform();
        browser.sleep(3000);
    }

    getWindowTitle() {
        return browser.getTitle();
    }

    selectFirstPhoto() {
        element(by.css('.photo:first-child')).click();
    }

    getMessage() {
        return element(by.css('.alert-success')).getText();
    }
}
