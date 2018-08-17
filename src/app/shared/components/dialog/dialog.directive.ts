import { Directive, ViewContainerRef, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { DialogComponent } from './dialog.component';

@Directive({ selector: '[dialogAnchor]' })
/**
 * ViewContainerRef represents container where one or 
 * more view can be attached.
 * 
**/
export class DialogDirective {
    constructor(
        private viewContainer: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {}

    createDialog() {
        this.viewContainer.clear();
        const dialogComponentFactory = this.componentFactoryResolver
            .resolveComponentFactory(DialogComponent);
        const dialogComponentRef = this.viewContainer
            .createComponent(dialogComponentFactory);
        dialogComponentRef
            .instance
            .close
            .subscribe(() => dialogComponentRef.destroy());
        return dialogComponentRef;
    }
}