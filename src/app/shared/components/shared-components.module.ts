import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AlertComponent } from './alert/alert.component';
import { CardComponent } from './card/card.component';
import { LoadingComponent } from './loading/loading.component';
import { MenuComponent } from './menu/menu.component';
import { VMessageComponent } from './vmessage/vmessage.component';
import { LoadingInterceptor } from './loading/loading.interceptor';
import { DialogComponent } from './dialog/dialog.component';
import { DialogDirective } from './dialog/dialog.directive';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@NgModule({
    declarations: [
        AlertComponent,
        CardComponent,
        LoadingComponent,
        MenuComponent,
        VMessageComponent,
        DialogComponent,
        DialogDirective,
        ConfirmDialogComponent
    ],
    entryComponents: [
        DialogComponent
    ],
    exports: [
        AlertComponent,
        CardComponent,
        LoadingComponent,
        MenuComponent,
        VMessageComponent,
        DialogComponent,
        DialogDirective,
        ConfirmDialogComponent
    ],
    imports: [
        CommonModule
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: LoadingInterceptor,
        multi: true
    }]   
})
export class SharedComponentModule {}