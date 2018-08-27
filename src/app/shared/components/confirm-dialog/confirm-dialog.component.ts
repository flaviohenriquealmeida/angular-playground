import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';

@Component({
    selector: 'ap-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {

    constructor(private scrollService: ScrollService) {}
    
    @Input() message = 'Are you sure?';
    @Output() onConfirm = new EventEmitter<void>();
    @ViewChild('buttonConfirm') firstFocusableEl: ElementRef<HTMLButtonElement>;
    @ViewChild('buttonDismiss') lastFocusableEl: ElementRef<HTMLButtonElement>;
    
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
        this.lastFocusableEl.nativeElement.focus();
        this.isShown = true;
    }
    
    dismiss() {
       this.isShown = false;
       this.scrollService.enableScrolling();
    }

    
    handleTab(event: any) {        
        console.log(this.firstFocusableEl);
        const isTabPressed = event.key === 'Tab';
        const isShiftPressed = event.shiftKey;
  
        console.log('tab', isTabPressed);
        console.log('shigt', isShiftPressed);

        if (!isTabPressed) { 
            return; 
        }
        
        if(event.shiftKey) { // SHIFT + TAB
            if(document.activeElement === this.firstFocusableEl.nativeElement) {
                this.lastFocusableEl.nativeElement.focus();
                event.preventDefault();
            }
        } else { // TAB
            if (document.activeElement === this.lastFocusableEl.nativeElement) {
                this.firstFocusableEl.nativeElement.focus();
                event.preventDefault();
            }
        }
        
    }
}