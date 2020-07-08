import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap, catchError } from "rxjs/operators";
import { of } from 'rxjs';

import { PhotosActions } from "./photos.action.types";
import { PhotoService } from './photo/photo.service';
import { allPhotosLoaded, photoLoded, photoDeleted, deletePhotoError } from './photos.actions';

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
        map(selectedPhoto => photoLoded({ selectedPhoto }))
      )
  );

  public deletePhoto$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(PhotosActions.deletePhoto),
        switchMap(action =>
          this.photosService
          .removePhoto(parseInt(action.photoId))
          .pipe(catchError(err => {
            console.log(err);
            return of(deletePhotoError());
          }))
          .pipe(map(() => photoDeleted()))
        )
      )
  );

  public updatePhotosLike = createEffect(
    () => this.actions$
      .pipe(ofType(PhotosActions.updatePhotoLikes))
      .pipe(switchMap(update => this.photosService.like(<number>update.update.id))),
    { dispatch: false }
  )

  constructor(
    private actions$: Actions,
    private photosService: PhotoService,
  ) {}
}
