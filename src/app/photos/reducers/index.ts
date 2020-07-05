import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../../environments/environment';

export const photosFeatureKey = 'photos';

export interface PhotosState {

}

export const reducers: ActionReducerMap<PhotosState> = {

};


export const metaReducers: MetaReducer<PhotosState>[] = !environment.production ? [] : [];
