import { Component } from '@angular/core';
import { UserService } from '../../../core/user/user.service';
import { Observable } from 'rxjs';
import { User } from '../../../core/user/user';
import { Router } from '@angular/router';

@Component({
    selector: 'ap-profile-menu',
    templateUrl: './profile-menu.component.html',
    styleUrls: ['./profile-menu.component.css']
})
export class ProfileMenuComponent { 

    isShown = false;

    user$: Observable<User>
    constructor(
        private userService: UserService, 
        private router:Router) {

        this.user$ = userService.getUser();
    }

    logout() {
        this.userService.logout();
        this.router.navigate(['']);
    }

    toggle() {
        this.isShown = !this.isShown;
    }
}
