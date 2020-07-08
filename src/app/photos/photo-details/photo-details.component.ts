import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { switchMap, tap, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

import { PhotoService } from "../photo/photo.service";
import { Photo } from "../photo/photo";
import { AlertService } from "../../shared/components/alert/alert.service";
import { UserService } from "../../core/services/user/user.service";
import { PhotoComment } from '../photo/photo-comment';
import { ConfirmDialogService } from '../../shared/components/confirm-dialog/confirm-dialog.service';
import { State } from 'src/app/reducers';
import { selectPhoto } from '../photos.selectors';
import { deletePhoto, deletePhotoError, photoDeleted, updatePhotoLikes } from '../photos.actions';
import { Update } from '@ngrx/entity';

@Component({
  templateUrl: './photo-details.component.html'
})
export class PhotoDetailsComponent implements OnInit, OnDestroy {

  public photo$: Observable<Photo>;
  public comments$: Observable<PhotoComment[]>
  public commentsCountFromCurrentUser = 0;

  private photoId: string;
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private photoService: PhotoService,
    private router: Router,
    private alertService: AlertService,
    private userService: UserService,
    private confirmDialogService: ConfirmDialogService,
    private store: Store<State>,
    private actions$: Actions
  ) { }

  public ngOnDestroy(): void {
    this.unsubscribe.next(),
      this.unsubscribe.complete()
  }

  public ngOnInit(): void {
    this.photoId = this.route.snapshot.paramMap.get('photoId');
    this.comments$ = this.photoService.getComments(parseInt(this.photoId));

    // why the selector is not type safe here?
    this.photo$ = this.store.pipe(select(selectPhoto));
    /*
    this.photo$ = this.photoService.findById(this.photoId);

    this.photo$.subscribe(() => {}, err => {
        console.log(err);
        this.router.navigate(['not-found']);
    });
    */
  }

  public remove(): void {
    this.store.dispatch(deletePhoto({ photoId: this.photoId }))

    // I don't like to subscribe for every action how handle special logic
    // I can'do that inside the effect because I need the username, so I would
    // have to add the user name as a parameter.
    this.actions$
      .pipe(
        ofType(photoDeleted),
        switchMap(() => this.userService.getUser$()),
        takeUntil(this.unsubscribe)
      )
      .subscribe(user => {
        this.alertService.success("Photo removed", true);
        this.router.navigate(['/user', user.name], { replaceUrl: true });
      });

    this.actions$
      .pipe(
        ofType(deletePhotoError),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => {
        this.alertService.warning('Could not delete the photo!', true);
      });

    /*
      this.confirmDialogService.open({
          onConfirm: () => {
              this.store.dispatch(deletePhoto({ photoId: this.photoId }))
              this.photoService
              .removePhoto(parseInt(this.photoId))
              .pipe(switchMap(() => this.userService.getUser$()))
              .subscribe(
                  user => {
                      this.alertService.success("Photo removed", true);
                      this.router.navigate(['/user', user.name], { replaceUrl: true });
                  },
                  err => {
                      console.log(err);
                      this.alertService.warning('Could not delete the photo!', true);
                  });
          }
      });
      */
  }

  public like(photo: Photo): void {
    const likes = photo.likes + 1;
    const update: Update<Photo> = {
      id: photo.id,
      changes: {...photo, likes }
    };
    this.store.dispatch(updatePhotoLikes({ update }));
  }

    /*
    this.photoService
      .like(photo.id)
      .subscribe(liked => {
        if (liked) {
          this.photo$ = this.photoService.findById(photo.id);
        }
      });
      */

  public addComment(comment: string): void {
    this.comments$ = this.photoService
      .addComment(parseInt(this.photoId), comment)
      .pipe(switchMap(() => this.photoService.getComments(parseInt(this.photoId))))
      .pipe(tap(() => this.commentsCountFromCurrentUser++));
  }
}
