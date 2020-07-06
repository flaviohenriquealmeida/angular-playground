import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Photo } from '../photo/photo';
import { PhotosState } from '../photos.reducers';
import { loadAllPhotos } from '../photos.actions';
import { tap, first, filter, map } from 'rxjs/operators';
import { arePhotosLoaded } from '../photos.selectors';

@Injectable({ providedIn: 'root' })
export class PhotoListResolver implements Resolve<Observable<Photo[]>>{

  constructor(
    private store: Store<PhotosState>
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const userName = route.paramMap.get('userName');
    return this.store
      .pipe(
        select(arePhotosLoaded),
        tap(photosLoaded => {
          if (!photosLoaded) {
            this.store.dispatch(loadAllPhotos({ userName }));
          }
        }),
        filter(photosLoaded => photosLoaded), //can only complete if loaded, So the first() won't be applied if the filter is false
        first()
      );
  }
}
