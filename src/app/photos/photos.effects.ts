import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap } from "rxjs/operators";

import { PhotosActions } from "./photos.action.types";
import { PhotoService } from './photo/photo.service';
import { allPhotosLoaded, photoLoded } from './photos.actions';

@Injectable()
export class PhotosEffects {

  public loadPhotos$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(PhotosActions.loadAllPhotos),
        switchMap(action => this.photosService.getAll(action.userName)),
        map(photos => allPhotosLoaded({ photos }))
      )
  );

  public loadPhoto$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(PhotosActions.loadPhoto),
        switchMap(action => this.photosService.findById(parseInt(action.photoId))),
        map(photo => photoLoded({ photo }))
      )
  );

  constructor(
    private actions$: Actions,
    private photosService: PhotoService
  ) {}
}
