import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedDirectiveModule } from './directives/shared-directives.module';
import { SharedComponentModule } from './components/shared-components.module';

@NgModule({
    imports: [],
    exports: [
        SharedDirectiveModule,
        SharedComponentModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule
    ]   
})
export class SharedModule {}