import { HttpClient, HttpParams, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, throwError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { Photo } from "./photo";
import { PhotoComment } from './photo-comment';

const API = environment.ApiUrl;

@Injectable({ providedIn: 'root' })
export class PhotoService {

  constructor(private http: HttpClient) { }

  public listFromUser(userName: string): Observable<Photo[]> {
    return this.http
      .get<Photo[]>(API + '/' + userName + '/photos');
  }

  public getAll(userName: string): Observable<Photo[]> {
    return this.http.get<Photo[]>(API + '/' + userName + '/photos');
  }

  public getPaginator(userName: string, page: number = 1) {

    return () => {

      const params = new HttpParams()
        .append('page', page.toString());

      page++;

      return this.http
        .get<Photo[]>(API + '/' + userName + '/photos', { params })
    };
  }

  public upload(description: string, allowComments: boolean, file: File): Observable<HttpEvent<Object>> {

    const formData = new FormData();
    formData.append('description', description);
    formData.append('allowComments', allowComments ? 'true' : 'false');
    formData.append('imageFile', file);

    return this.http.post(
      API + '/photos/upload',
      formData,
      {
        observe: 'events',
        reportProgress: true
      }
    );

  }

  public findById(photoId: number): Observable<Photo> {

    return this.http.get<Photo>(API + '/photos/' + photoId);
  }

  public getComments(photoId: number): Observable<PhotoComment[]> {
    return this.http.get<PhotoComment[]>(
      API + '/photos/' + photoId + '/comments'
    );
  }

  public addComment(photoId: number, commentText: string): Observable<void> {

    return this.http.post<void>(
      API + '/photos/' + photoId + '/comments',
      { commentText }
    );
  }

  public removePhoto(photoId: number): Observable<void> {
    return this.http.delete<void>(API + '/photos/' + photoId);
  }

  public like(photoId: number): Observable<boolean> {

    return this.http.post(
      API + '/photos/' + photoId + '/like', {}, { observe: 'response' }
    )
      .pipe(map(res => true))
      .pipe(catchError(err => {
        return err.status == '304' ? of(false) : throwError(err);
      }));
  }
}
