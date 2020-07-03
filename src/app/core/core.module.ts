import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HeaderComponent } from './components/header/header.component';
import { RequestInterceptor } from './services/auth/request.interceptor';
import { ResponseInterceptor } from './services/auth/response.interceptor';
import { FooterComponent } from './components/footer/footer.component';
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
