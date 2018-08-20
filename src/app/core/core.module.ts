import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { RequestInterceptor } from './auth/request.interceptor';
import { ResponseInterceptor } from './auth/response.interceptor';
import { FooterComponent } from './footer/footer.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent
    ],
    exports: [
        HeaderComponent,
        FooterComponent
    ],
    imports: [
        SharedModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: RequestInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ResponseInterceptor,
            multi: true
        }
    ]
})
export class CoreModule { }