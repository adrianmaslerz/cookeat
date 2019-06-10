import { Component, OnInit } from '@angular/core';


import {
    Plugins,
    PushNotification,
    PushNotificationToken,
    PushNotificationActionPerformed
} from '@capacitor/core';
import { Favourite } from '../../../../models/favourite.model';
import { Recipe } from '../../../../models/recipe.model';
import { RecipesDataService } from '../../../../services/data/recipes.data.service';
import { Platform } from '@ionic/angular';
import { AuthService } from '../../../../services/core/auth.service';
import { UsersDataService } from '../../../../services/data/users.data.service';

const { PushNotifications } = Plugins;


@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: [ './home.page.scss' ],
})
export class HomePage implements OnInit
{
    inProgress: boolean = false;
    results: Array<Recipe> = [];

    constructor(private platform: Platform, private recipesDataService: RecipesDataService, private authService: AuthService, private usersDataService: UsersDataService) { }

    ngOnInit()
    {
        this.recipesDataService
            .getRecipes("za")
            .subscribe(snapshotList => {
                this.results = snapshotList.map(snapshot => <Recipe>{ ...snapshot.payload.val(), key: snapshot.key } ).slice(8, 10);
            })

        if(this.platform.is("android") || this.platform.is("ios"))
        {
            console.log('Initializing HomePage');
            //Register with Apple / Google to receive push via APNS/FCM
            PushNotifications.register();

            // On succcess, we should be able to receive notifications
            PushNotifications.addListener('registration',
                (token: PushNotificationToken) => {
                    //alert('Push registration success, token: ' + token.value);
                    this.usersDataService.addToken(this.authService.logged.id, token.value);
                }
            );

            // Some issue with our setup and push will not work
            PushNotifications.addListener('registrationError',
                (error: any) => {
                    alert('Error on registration: ' + JSON.stringify(error));
                }
            );

            // // Show us the notification payload if the app is open on our device
            // PushNotifications.addListener('pushNotificationReceived',
            //     (notification: PushNotification) => {
            //         alert('Push received: ' + JSON.stringify(notification));
            //     }
            // );
            //
            // // Method called when tapping on a notification
            // PushNotifications.addListener('pushNotificationActionPerformed',
            //     (notification: PushNotificationActionPerformed) => {
            //         alert('Push action performed: ' + JSON.stringify(notification));
            //     }
            // );
        }
    }

}
