import { NgModule } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { CardComponent } from './card/card.component';
import { LoadingComponent } from './loading/loading.component';
import { MenuComponent } from './menu/menu.component';
import { VMessageComponent } from './vmessage/vmessage.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './loading/loading.interceptor';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        AlertComponent,
        CardComponent,
        LoadingComponent,
        MenuComponent,
        VMessageComponent
    ],
    exports: [
        AlertComponent,
        CardComponent,
        LoadingComponent,
        MenuComponent,
        VMessageComponent
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