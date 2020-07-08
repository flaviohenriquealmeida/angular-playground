import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  createReducer,
  MetaReducer,
  on
} from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { environment } from '../../environments/environment';

import { Photo } from './photo/photo';
import { PhotosActions } from './photos.action.types';

export const photosFeatureKey = 'photos';
export interface PhotosState extends EntityState<Photo> {
  allPhotosLoaded: boolean,
  selectedPhoto: Photo, // cuidado, se usar o nome photo por algum motivo nao funciona
};

export const photosAdapter = createEntityAdapter<Photo>();
export const initialState = photosAdapter.getInitialState({
  allPhotosLoaded: false,
  selectedPhoto: null
});

export const photosReducer = createReducer(
  initialState,
  on(PhotosActions.allPhotosLoaded, (state, action) => {
    return photosAdapter.addAll(action.photos, {...state, allPhotosLoaded: true });
  }),
  on(PhotosActions.photoLoded, (state, action) => {
    return { ...state, selectedPhoto: action.selectedPhoto };
  }),
  on(PhotosActions.deletePhoto, (state, action) => {
    return photosAdapter.removeOne(action.photoId, state);
  }),
  on(PhotosActions.updatePhotoLikes, (state, action) => {
    const newState = photosAdapter.updateOne(action.update, state);
    // if I use action.update directly, won't work. Need to create a new reference.
    const newPhoto = {...action.update.changes };
    return { ...newState, selectedPhoto: newPhoto };
  })
);

export const { selectAll: selectAllPhotos } = photosAdapter.getSelectors();

export const metaReducers: MetaReducer<PhotosState>[] = !environment.production ? [] : [];
