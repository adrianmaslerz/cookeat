import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { UsersDataService } from '../data/users.data.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService
{
    constructor(private fireAuth: AngularFireAuth, private usersDataService: UsersDataService) { }

    register(data: Object) : Promise<any>
    {
        return this.fireAuth.auth
            .createUserWithEmailAndPassword(data["email"], data["password"])
            .then(result => {
                data["id"] = result.user.uid;
                return this.usersDataService.addUser(data);
            });
    }

    login(data: Object) : Observable<any>
    {
        return from(this.fireAuth.auth.signInWithEmailAndPassword(data["email"], data["password"]));
    }
}
