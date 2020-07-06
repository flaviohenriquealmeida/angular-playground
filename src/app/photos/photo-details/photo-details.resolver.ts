import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { State } from 'src/app/reducers';
import { selectPhoto } from '../photos.selectors';
import { tap, filter, first } from 'rxjs/operators';
import { loadPhoto } from '../photos.actions';

@Injectable()
export class PhotoDetailsResolver implements Resolve<void> {

  constructor(private store: Store<State>) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

    const photoId = route.paramMap.get('photoId');
    return this.store
      .pipe(
        select(selectPhoto, { photoId }),
        tap(photo => {
          if (!photo) {
            this.store.dispatch(loadPhoto({ photoId }));
          }
        }),
        filter(photo => photo),
        first()
      );
  }

}
