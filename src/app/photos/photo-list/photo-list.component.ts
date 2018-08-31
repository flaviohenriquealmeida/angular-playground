import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Photo } from '../photo/photo';
import { PhotoService } from '../photo/photo.service';
import { tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html'
})
export class PhotoListComponent implements OnInit {

  photos: Photo[] = [];
  filter = '';
  hasMore = true;
  currentPage = 1;
  userName = '';
  loading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private photoService: PhotoService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.userName = params.userName;
      this.photos = this.activatedRoute.snapshot.data['photos'];
    });
  }

  load(event) {
    if (event != 'bottom') return;
    if (this.hasMore) {
      this.loading = true
      this.photoService
        .listFromUserPaginated(this.userName, ++this.currentPage)
        .pipe(finalize(() => this.loading = false))
        .subscribe(photos => {
          this.filter = '';
          this.photos = this.photos.concat(photos);
          if (!photos.length) this.hasMore = false;
        });
    }
  }
}
