import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { User } from './models/user.model';
import { AuthService } from './services/core/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit
{
    user: User;
    constructor(private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar, private authService: AuthService, private fireAuth: AngularFireAuth)
    {
        this.initializeApp();
    }

    ngOnInit(): void
    {
        this.authService.user.subscribe((user: User) => this.user = user);
    }

    initializeApp()
    {
        this.platform.ready().then(() =>
        {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    onLogout()
    {
        this.fireAuth.auth.signOut();
    }
    onChangePassword()
{
    console.log("elo");
}
}
