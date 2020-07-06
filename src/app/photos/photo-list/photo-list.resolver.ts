import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Photo } from '../photo/photo';
import { PhotosState } from '../photos.reducers';
import { loadAllPhotos } from '../photos.actions';
import { tap, first, filter, finalize } from 'rxjs/operators';
import { arePhotosLoaded } from '../photos.selectors';

@Injectable({ providedIn: 'root' })
export class PhotoListResolver implements Resolve<Observable<Photo[]>>{

  private loading: boolean = false;

  constructor(
    private store: Store<PhotosState>
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const userName = route.paramMap.get('userName');
    return this.store
      .pipe(
        select(arePhotosLoaded),
        tap(photosLoaded => {
          if (!this.loading && !photosLoaded) {
            this.loading = true;
            this.store.dispatch(loadAllPhotos({ userName }));
          }
        }),
        filter(photosLoaded => photosLoaded),
        first(),
        finalize(() => this.loading = false)
      );
  }
}
