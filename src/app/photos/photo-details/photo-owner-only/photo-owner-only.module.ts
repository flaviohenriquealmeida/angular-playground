import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotoOwnerOnlyDirective } from './photo-owner-only.directive';

@NgModule({
    declarations: [PhotoOwnerOnlyDirective],
    exports: [PhotoOwnerOnlyDirective],
    imports: [CommonModule]
})
export class PhotoOwnerOnlyModule { }
