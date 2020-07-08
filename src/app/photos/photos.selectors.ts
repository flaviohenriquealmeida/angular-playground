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

// why props is not type safe?
export const findPhotoById = createSelector(
  selectAllPhotos,
  (photos, props) => photos.filter(photo => {
    return photo.id == props.photoId;
  })[0]
);

export const selectPhoto = createSelector(
  selectPhotosState,
  (state: fromPhotos.PhotosState) => state.selectedPhoto);

export const isPhotoLoaded = createSelector(
  selectPhoto,
  photo => !!photo
);
