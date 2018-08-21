import { ErrorHandler, Injectable, Injector } from "@angular/core";
import * as StackTrace from 'stacktrace-js';
import { LocationStrategy, PathLocationStrategy } from "@angular/common";
import { Router } from "@angular/router";
import { environment } from '../../../environments/environment';
import { from } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

import { UserService } from "../../core/user/user.service";
import { ServerLogService } from "./server-log.service";

const stackFrameArrayToString = (stackArray: StackTrace.StackFrame[]) => 
    stackArray.map(sf => sf.toString()).join('\n');

const logToConsole = (
        message: string, userName: string, 
        urlAcessed: string, stackFrame: string) => {
    console.log(`%cERROR Error: ${message}`, 'font-size: 13px; font-weight: bold');
    console.table({userName, urlAcessed});
    console.log(stackFrame);
}

const createLogObject = (
    message: string, userName: string, 
    urlAcessed: string, stackFrame: string) => ({ 
        message, 
        url: urlAcessed, 
        userName: userName,
        stack: stackFrame 
    });

const logToConsoleAndCreateObjectLog = (
    message: string, userName: string, 
    urlAcessed: string, stackFrame: string) => {
        logToConsole(message, userName, urlAcessed, stackFrame);
        return createLogObject(message, userName, urlAcessed, stackFrame);
}

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    private location: LocationStrategy;
    private userService: UserService;
    private serverLogService: ServerLogService;
    private router: Router;
    private dependenciesInjected = false;

    constructor(private injector: Injector) {}

    handleError(error: any): void {

        if(!this.dependenciesInjected) this.injectDependencies();

        const url = this.location instanceof PathLocationStrategy 
            ? this.location.path() 
            : ''; 

        const message = error.message 
            ? error.message : 
            error.toString();

        if(environment.production) this.router.navigate(['/error']);

        from(StackTrace.fromError(error))
            .pipe(map(stackFrameArrayToString))
            .pipe(withLatestFrom(this.userService.getUser()))
            .pipe(
                switchMap(([stackFrameAsString, user]) =>  {
                    const log = logToConsoleAndCreateObjectLog(
                        message, url, user.name, stackFrameAsString);
                    return this.serverLogService.log(log);
                })
            )
            .subscribe(
                () => console.log('Error logged on server'),
                err => {
                    console.log('Fail to send error log to server');
                }
            );       
    }
    private injectDependencies() {
        this.location = this.injector.get(LocationStrategy);
        this.userService = this.injector.get(UserService);
        this.serverLogService = this.injector.get(ServerLogService);
        this.router = this.injector.get(Router);
        this.dependenciesInjected = true;
    }
}

