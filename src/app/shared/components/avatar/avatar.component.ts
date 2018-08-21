import { Component, Input } from '@angular/core';

@Component({
    selector: 'ap-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.css']
})
export class AvatarComponent {

    @Input() imageSrc = 'assets/img/avatar.jpg';
    @Input() userName = 'Please login';
}