
import * as fromPhotos from '../actions/photos.action';
import { Photo } from '../../photo/photo';

export interface PhotosState {
    data: Photo[];
    loaded: boolean;
    loading: boolean;
}

export const initialState: PhotosState = { 
    data: [],
    loaded: false,
    loading: false
};

export function reducer(
    state = initialState, 
    action: fromPhotos.PhotosAction
): PhotosState {
    switch(action.type) {
        case fromPhotos.LOAD_PHOTOS: {
            return {
                ...state,
                loading: true
            };
        }
        case fromPhotos.LOAD_PHOTOS_FAIL: {
            return {
                ...state,
                loading: false
            };
        }
        case fromPhotos.LOAD_PHOTOS_SUCCESS: {
            return {
                ...state,
                loaded: true,
                loading: false,
            };
        }
    }
    return state;
}