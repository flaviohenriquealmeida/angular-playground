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
export interface PhotosState extends EntityState<Photo>{
  allPhotosLoaded: boolean
};

export const adapter = createEntityAdapter<Photo>();
export const initialState = adapter.getInitialState({
  allPhotosLoaded: false
});

export const photosReducer = createReducer(
  initialState,
  on(PhotosActions.allPhotosLoaded, (state, action) => {
    return adapter.addAll(action.photos, {...state, allPhotosLoaded: true });
  })
);

export const { selectAll, selectIds } = adapter.getSelectors();

export const metaReducers: MetaReducer<PhotosState>[] = !environment.production ? [] : [];
