import { NgModule } from '../../../../../node_modules/@angular/core';
import { SafePipe } from './safe.pipe';

@NgModule({
    declarations: [SafePipe],
    exports: [SafePipe]
})
export class SafePipeModule {}