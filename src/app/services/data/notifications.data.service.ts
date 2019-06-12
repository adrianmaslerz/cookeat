import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationsDataService
{
    constructor(private fireDatabase: AngularFireDatabase) { }

    getUserNotifications(userId: string) : Observable<any>
    {
        return this.fireDatabase
            .list<Notification>("notifications", ref => {
                return ref.orderByChild("user_id").equalTo(userId);
            })
            .snapshotChanges();
    }
}
