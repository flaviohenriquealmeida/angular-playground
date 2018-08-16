import { Directive, ViewContainerRef, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { DialogComponent } from './dialog.component';

@Directive({ selector: '[dialogAnchor]' })
export class DialogDirective {
    constructor(
        private viewContainer: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {}

    createDialog(dialogComponent: { new(): DialogComponent }): ComponentRef<DialogComponent> {
        this.viewContainer.clear();

        const dialogComponentFactory = 
          this.componentFactoryResolver.resolveComponentFactory(dialogComponent);
        const dialogComponentRef = this.viewContainer.createComponent(dialogComponentFactory);
        
        dialogComponentRef.instance.close.subscribe(() => {
            dialogComponentRef.destroy();
        });

        return dialogComponentRef;
    }
}