import { createAction, props } from "@ngrx/store";

import { Photo } from './photo/photo'

export const loadAllPhotos = createAction(
  '[Photos Resolver] Load All Photos',
  props<{ userName: string }>()
);

export const allPhotosLoaded = createAction(
  '[Load Photos Effect] All photos loaded',
  props<{ photos: Photo[] }>()
);
