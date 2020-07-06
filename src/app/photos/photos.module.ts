import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PhotoModule } from './photo/photo.module';
import { PhotoFormModule } from './photo-form/photo-form.module';
import { PhotoListModule } from './photo-list/photo-list.module';
import { PhotoDetailsModule } from './photo-details/photo-details.module';
import { PhotosRoutingModule } from './photos.routing.module';
import * as fromPhotos from './photos.reducers';
import { PhotosEffects } from './photos.effects';

@NgModule({
    imports: [
        PhotoModule,
        PhotoFormModule,
        PhotoListModule,
        PhotoDetailsModule,
        PhotosRoutingModule,
        StoreModule.forFeature(fromPhotos.photosFeatureKey, fromPhotos.photosReducer, { metaReducers: fromPhotos.metaReducers }),
        EffectsModule.forFeature([PhotosEffects]),
    ]
})
export class PhotosModule {}
