import { NgModule } from '@angular/core';

import { PhotoComponent } from './photo.component';
import { SharedModule } from '../../shared/shared.module';
import { PhotoListResolver } from '../photo-list/photo-list.resolver';

@NgModule({
    declarations: [PhotoComponent],
    imports: [SharedModule],
    exports: [PhotoComponent]
})
export class PhotoModule { }
