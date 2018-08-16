import { Component, OnInit, ElementRef, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PlatformDetectorService } from '../../core/plataform-detector/platform-detector.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { DialogDirective } from '../../shared/components/dialog/dialog.directive';

@Component({
    templateUrl: './signin.component.html'
})
export class SignInComponent implements OnInit {
    
    fromUrl: string;
    loginForm: FormGroup;
    @ViewChild('userNameInput') userNameInput: ElementRef<HTMLInputElement>;
    @ViewChild(DialogDirective) dialogAnchor: DialogDirective;
  
    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private platformDetectorService: PlatformDetectorService,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.activatedRoute
            .queryParamMap
            .subscribe(params => 
                    this.fromUrl = params.get('fromUrl'));

        this.loginForm = this.formBuilder.group({
            userName: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.platformDetectorService.isPlatformBrowser() && 
        this.userNameInput.nativeElement.focus();        
    } 

    login() {
        const userName = this.loginForm.get('userName').value;
        const password = this.loginForm.get('password').value;

        this.authService
            .authenticate(userName, password)
            .subscribe(
                () => this.fromUrl 
                    ? this.router.navigateByUrl(this.fromUrl)
                    : this.router.navigate(['user', userName])
                ,
                err => {
                    console.log(err);
                    this.loginForm.reset();
                    this.platformDetectorService.isPlatformBrowser() && 
                        this.userNameInput.nativeElement.focus();
                    alert('Invalid user name or password');
                }
            );
    }

    openDialogBox() {
        this.dialogAnchor.createDialog(DialogComponent);
    }
}