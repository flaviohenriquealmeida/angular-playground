import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';

@Component({
    selector: 'ap-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.css'],
})
export class ConfirmDialogComponent  {
    
    constructor(private scrollService: ScrollService) {}

    @Input() message = 'Are you sure?';
    @Output() onConfirm = new EventEmitter<void>();
    isShown = false;
    
    confirm() {
        this.dismiss();
        this.onConfirm.emit();
    }

    cancel() {
        this.dismiss();
    }
    
    show() {
        this.scrollService.disableScrolling();
        this.isShown = true;
    }
    
    dismiss() {
       this.isShown = false;
       this.scrollService.enableScrolling();
    }
}