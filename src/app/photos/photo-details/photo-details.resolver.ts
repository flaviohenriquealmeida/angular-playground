import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { State } from 'src/app/reducers';
import { selectPhoto, isPhotoLoaded, findPhotoById } from '../photos.selectors';
import { tap, filter, first, switchMapTo, switchMap, concatMap } from 'rxjs/operators';
import { loadPhoto, photoLoded } from '../photos.actions';

@Injectable()
export class PhotoDetailsResolver implements Resolve<void> {

  constructor(private store: Store<State>) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const photoId = route.paramMap.get('photoId');
    return this.store
      .pipe(
        select(findPhotoById, { photoId }),
        tap(photo => {
          if (!photo) {
            this.store.dispatch(loadPhoto({ photoId }));
          } else {
            this.store.dispatch(photoLoded({ selectedPhoto: photo }));
          }
        }),
        switchMap(() => this.store.pipe(select(isPhotoLoaded))),
        filter(photoLoaded => photoLoaded),
        first()
      );
  }

}
