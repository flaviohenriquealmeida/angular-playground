import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
    selector: 'ap-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
    @Output() close = new EventEmitter<void>();
    @Input() message: string = "Hello, I'm a dialog box!";

    onClickedExit() {
        this.close.emit();
    }
}