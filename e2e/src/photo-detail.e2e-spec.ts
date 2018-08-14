import {PhotoDetailPage} from './photo-detail.po';

describe('PhotoDetailPage', () => {

    let page: PhotoDetailPage;

    beforeEach(() => {
        page = new PhotoDetailPage();
    });

    it('Should show selected photo', async () => {
        page.navigateTo();
        page.selectFirstPhoto();
        const title = await page.getWindowTitle();
        expect('Photo detail').toEqual(title);
    });

    it('Should show remove message after deletion', async () => {
        page.clickToRemove();
        const title = await page.getWindowTitle();
        expect(page.getMessage()).toEqual('Photo removed');
    });    
});