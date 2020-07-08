import { NgModule } from '@angular/core';

import { PhotoFormComponent } from './photo-form.component';
import { PhotoModule } from '../photo/photo.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    declarations: [PhotoFormComponent],
    exports: [PhotoFormComponent],
    imports: [
        PhotoModule,
        SharedModule
    ]
})
export class PhotoFormModule { }
