import { NgModule } from "@angular/core";

import { PhotoDetailsComponent } from "./photo-details.component";
import { PhotoModule } from "../photo/photo.module";
import { PhotoCommentsComponent } from "./photo-comments/photo-comments.component";
import { PhotoOwnerOnlyDirective } from "./photo-owner-only/photo-owner-only.directive";
import { SharedModule } from '../../shared/shared.module';
import { PhotoDetailsResolver } from './photo-details.resolver'

@NgModule({
    declarations: [
        PhotoDetailsComponent,
        PhotoCommentsComponent,
        PhotoOwnerOnlyDirective
    ],
    exports: [
        PhotoDetailsComponent,
        PhotoCommentsComponent
    ],
    imports: [
        PhotoModule,
        SharedModule
    ],
    providers: [PhotoDetailsResolver]
})
export class PhotoDetailsModule { }
