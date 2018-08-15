import { NgModule } from '@angular/core';
import { DarkenOnHoverDirective } from './darken-on-hover/darken-on-hover.directive';
import { ImmediateClickDirective } from './immediate-click/immediate-click.directive';
import { ShowIfLoggedDirective } from './show-if-logged/show-if-logged.directive';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        DarkenOnHoverDirective,
        ImmediateClickDirective,
        ShowIfLoggedDirective
    ],
    exports: [
        DarkenOnHoverDirective,
        ImmediateClickDirective,
        ShowIfLoggedDirective,
    ]
})
export class SharedDirectiveModule {}