import { ErrorHandler, Injectable, Injector } from "@angular/core";
import * as StackTrace from 'stacktrace-js';
import { LocationStrategy, PathLocationStrategy } from "@angular/common";

import { UserService } from "../../core/user/user.service";
import { ServerLogService } from "./server-log.service";
import { Router } from "@angular/router";

import { environment } from '../../../environments/environment';
import { from } from 'rxjs';
import { map, switchMap, withLatestFrom, tap } from 'rxjs/operators';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    private location: LocationStrategy;
    private userService: UserService;
    private serverLogService: ServerLogService;
    private router: Router;

    constructor(private injector: Injector) {}

    handleError(error: any): void {

        this.location = this.location 
            ? this.location 
            : this.injector.get(LocationStrategy);

        this.userService = this.userService 
            ? this.userService 
            : this.injector.get(UserService);

        this.serverLogService = this.serverLogService 
            ? this.serverLogService 
            : this.injector.get(ServerLogService);

        this.router = this.router 
            ? this.router : 
            this.injector.get(Router);
        
        const url = location instanceof PathLocationStrategy 
            ? location.path() 
            : ''; 

        const message = error.message 
            ? error.message : 
            error.toString();

        if(environment.production) this.router.navigate(['/error']);

        from(StackTrace.fromError(error))
            .pipe(map(stackFrames => stackFrames
                .map(sf => sf.toString())
                .join('\n')
            ))
            .pipe(withLatestFrom(this.userService.getUser()))
            .pipe(switchMap(([stackFrameAsString, user]) =>   
                this.serverLogService.log({ 
                    message, 
                    url, 
                    userName: user.name,
                    stack: stackFrameAsString 
                })
            ))
            .subscribe(
                () => console.log('Error logged on server'),
                err => {
                    console.log(err);
                    console.log('Fail to send error log to server');
                }
            );       
    }
}