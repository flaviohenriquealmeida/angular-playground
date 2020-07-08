import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';

import { PhotoCommentsComponent } from './photo-comments.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
    declarations: [PhotoCommentsComponent],
    exports: [PhotoCommentsComponent],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        SharedModule
    ]
})
export class PhotoCommmentsModule {

}
