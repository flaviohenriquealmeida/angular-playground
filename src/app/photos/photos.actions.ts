import { createAction, props } from "@ngrx/store";

import { Photo } from './photo/photo'

export const loadAllPhotos = createAction(
  '[Photo List Resolver] Load All Photos',
  props<{ userName: string }>()
);

export const allPhotosLoaded = createAction(
  '[Load Photos Effect] All photos loaded',
  props<{ photos: Photo[] }>()
);

export const loadPhoto = createAction(
  '[Photo Resolver] Load Photo',
  props<{ photoId: string }>()
);

export const photoLoded = createAction(
  '[Photo Resolver] Photo Loaded',
  props<{ selectedPhoto: Photo }>()
);

export const deletePhoto = createAction(
  '[Photo Form] Delete Photo',
  props<{ photoId: string }>()
);

export const photoDeleted = createAction(
  '[Photos Effect] Photo deleted'
);

export const deletePhotoError = createAction(
  '[Photos Effect] Delete photo error'
);

