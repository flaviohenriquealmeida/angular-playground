import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPhotos from './photos.reducers';

export const selectPhotosState
  = createFeatureSelector<fromPhotos.PhotosState>(fromPhotos.photosFeatureKey);

export const selectAllPhotos = createSelector(
  selectPhotosState,
  fromPhotos.selectAll
);


export const arePhotosLoaded = createSelector(
  selectPhotosState,
  state => state.allPhotosLoaded
);
