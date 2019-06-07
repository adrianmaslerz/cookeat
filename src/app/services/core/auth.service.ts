import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { UsersDataService } from '../data/users.data.service';
import { User } from '../../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService
{
    public user : Subject<User> = new Subject();
    public logged: User;
    constructor(private fireAuth: AngularFireAuth, private usersDataService: UsersDataService) {}

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

    updateProfie(data: Object)
    {
        if(data["email"] != this.logged.email)
            this.fireAuth.auth.currentUser.updateEmail(data["email"])

        return from(this.usersDataService.updateUser(this.logged.id, data));
    }

    changePassword(password: string) : Observable<any>
    {
        return from(this.fireAuth.auth.currentUser.updatePassword(password));
    }

    loadLoggedUser(id: string)
    {
        this.usersDataService.getUser(id).valueChanges().subscribe((user: User) => {
            this.logged = user;
            this.user.next(user)
        });
    }
}
