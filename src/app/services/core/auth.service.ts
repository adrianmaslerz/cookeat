import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService
{
    constructor(private fireAuth: AngularFireAuth ) { }

    register(data: Object) : Observable<any>
    {
        return from(this.fireAuth.auth.createUserWithEmailAndPassword(data["email"], data["password"]));
    }

    login(data: Object) : Observable<any>
    {
        return from(this.fireAuth.auth.signInWithEmailAndPassword(data["email"], data["password"]));
    }
}
