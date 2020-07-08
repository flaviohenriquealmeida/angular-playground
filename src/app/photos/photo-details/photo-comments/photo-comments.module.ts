import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';

import { PhotoCommentsComponent } from './photo-comments.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [PhotoCommentsComponent],
  exports: [PhotoCommentsComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class PhotoCommmentsModule {

}
