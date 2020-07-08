import { NgModule } from "@angular/core";

import { PhotoDetailsComponent } from "./photo-details.component";
import { PhotoModule } from "../photo/photo.module";
import { PhotoCommentsComponent } from "./photo-comments/photo-comments.component";
import { PhotoOwnerOnlyDirective } from "./photo-owner-only/photo-owner-only.directive";
import { SharedModule } from '../../shared/shared.module';
import { PhotoDetailsResolver } from './photo-details.resolver'
import { PhotoCommmentsModule } from './photo-comments/photo-comments.module';
import { PhotoOwnerOnlyModule } from './photo-owner-only/photo-owner-only.module';

@NgModule({
    declarations: [
        PhotoDetailsComponent,
    ],
    exports: [
        PhotoDetailsComponent,
    ],
    imports: [
        PhotoModule,
        PhotoCommmentsModule,
        PhotoOwnerOnlyModule,
        SharedModule
    ],
    providers: [PhotoDetailsResolver]
})
export class PhotoDetailsModule { }
