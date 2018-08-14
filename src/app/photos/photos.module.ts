import { NgModule } from '@angular/core';

import { PhotoModule } from './photo/photo.module';
import { PhotoFormModule } from './photo-form/photo-form.module';
import { PhotoListModule } from './photo-list/photo-list.module';
import { DarkenOnHoverModule } from '../shared/directives/darken-on-hover/darken-on-hover.module';
import { PhotoDetailsModule } from './photo-details/photo-details.module';
import { PhotosRoutingModule } from './photos.routing.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [ 
        PhotoModule,
        PhotoFormModule,
        PhotoListModule,
        DarkenOnHoverModule,
        PhotoDetailsModule,
        PhotosRoutingModule
    ]
})
export class PhotosModule {}