import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ap-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
    
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
        this.isShown = true;
    }
    
    dismiss() {
       this.isShown = false;
    }
}