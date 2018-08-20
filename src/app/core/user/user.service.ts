import { Injectable } from '@angular/core';
import { TokenService } from '../token/token.service';
import { BehaviorSubject } from 'rxjs';
import { User } from './user';
import * as jtw_decode from 'jwt-decode';
import { AlertService } from '../../shared/components/alert/alert.service';

@Injectable({ providedIn: 'root'})
export class UserService { 

    private userSubject = new BehaviorSubject<User>(null);
    private user: User; 

    constructor(
        private tokenService: TokenService,
        private alertService: AlertService) { 

        if(this.tokenService.hasToken()) {
            if(tokenService.hasExpired()) {
                this.alertService.warning('Session expired. Please, login!', true);
                this.discartToken()
            } else {
                this.decodeAndNotify();
            }
        }
    }

    setToken(token: string) {
        this.tokenService.setToken(token);
        this.decodeAndNotify();
    }

    getUser() {
        return this.userSubject.asObservable();
    }

    private decodeAndNotify() {
        const token = this.tokenService.getToken();
        this.user = jtw_decode(token) as User;
        this.userSubject.next(this.user);
    }

    discartToken() {
        this.tokenService.removeToken();
        this.user = null;
        this.userSubject.next(this.user);
    }

    isLogged() {
        return this.tokenService.hasToken() && !this.tokenService.hasExpired();
    }
}