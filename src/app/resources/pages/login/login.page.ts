import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/core/auth.service';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: [ './login.page.scss' ],
})
export class LoginPage implements OnInit
{
    form: FormGroup;
    message: string = "";

    constructor(private authService: AuthService, private router: Router, private googlePlus: GooglePlus, private platform: Platform) { }

    ngOnInit()
    {
        this.form = new FormGroup({
            email: new FormControl(null, {
                updateOn: 'blur',
                validators: [ Validators.required, Validators.email ]
            }),
            password: new FormControl(null, {
                updateOn: 'blur',
                validators: [ Validators.required ]
            })
        });
    }

    onSubmit(): void
    {
        if (!this.form.valid)
        {
            return;
        }

        this.authService.login(this.form.value)
            .subscribe(response =>
            {
                this.message = "";
                this.router.navigate(["/logged","home"])
            }, (error =>
            {
                this.message = error.message
            }));
    }

    googleLogin()
    {
        if(this.platform.is("cordova"))
            this.nativeGoogleLogin();
        else
            this.webGoogleLogin()
    }

    async nativeGoogleLogin() : Promise<void>
    {
        try
        {
            const googleUser = await this.googlePlus.login({
                'webClientId': "503468010163-tj496pcs92g1li0k1r7376aihhccef0e.apps.googleusercontent.com",
                'offline': true,
                'scopes': 'profile'
            });

            return await this.authService.loginGoogleNative(googleUser);
        }
        catch (error)
        {
            console.log(error)
        }
    }

    async webGoogleLogin() : Promise<void>
    {
        try
        {
           this.authService.loginGoogleWeb();
        }
        catch (error)
        {
            console.log(error)
        }
    }
}
