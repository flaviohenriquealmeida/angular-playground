import { ActionReducerMap } from '@ngrx/store';

import * as fromPhotos from './photos.reducer';

export interface PhotosState {
    photos: fromPhotos.PhotosState;
}

export const reducers: ActionReducerMap<PhotosState> = {
    photos: fromPhotos.reducer
};