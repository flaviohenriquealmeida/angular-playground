import { Component, OnInit  }from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { State } from 'src/app/reducers';
import { selectAllPhotos } from '../photos.selectors';
import { Photo } from '../photo/photo';
import { PhotoService } from '../photo/photo.service';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html'
})
export class PhotoListComponent implements OnInit {

  photos$: Observable<Photo[]> = of([]);
  filter = '';
  hasMore = true;
  userName = '';
  loading = false;
  photosPaginator: () => Observable<Photo[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private photoService: PhotoService,
    private store: Store<State>
  ) { }

  ngOnInit(): void {
    this.photos$ = this.store.pipe(select(selectAllPhotos));
    this.activatedRoute.params.subscribe(params => {
      this.userName = params.userName;
     // this.photosPaginator = this.photoService.getPaginator(this.userName, 2);
    });
  }

  load(event) {
    /*
    if (event != 'bottom') return;
    if (this.hasMore) {
      this.loading = true
      this.photosPaginator()
        .pipe(finalize(() => this.loading = false))
        .subscribe(photos => {
          this.filter = '';
          this.photos = this.photos.concat(photos);
          if (!photos.length) this.hasMore = false;
        });
    }
    */
  }
}
