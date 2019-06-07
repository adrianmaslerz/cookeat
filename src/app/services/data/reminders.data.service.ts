import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Reminder } from '../../models/reminder.model';

@Injectable({
    providedIn: 'root'
})
export class RemindersDataService
{
    constructor(private fireDatabase: AngularFireDatabase) { }

    getUserReminders(userId: string) : Observable<any>
    {
        return this.fireDatabase
            .list<Reminder>("reminders", ref => {
                return ref.orderByChild("user_id").equalTo(userId);
            })
            .snapshotChanges();
    }

    addReminder(reminder: Reminder)
    {
        const ref = this.fireDatabase.list("reminders");
        return ref.push(reminder);
    }

    removeReminder(key: string) : Promise<any>
    {
        const ref = this.fireDatabase.object("reminders/" + key);
        return ref.remove();
    }
}
