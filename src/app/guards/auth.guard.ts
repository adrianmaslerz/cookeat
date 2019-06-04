import { Injectable } from '@angular/core';
import { Router, CanLoad, Route, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../services/core/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanLoad
{
    constructor(private fireAuth: AngularFireAuth, private router: Router, private authService: AuthService) { }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean
    {
        return new Promise(resolve => {

            this.fireAuth.authState.subscribe(auth => {
                if(!auth)
                {
                    this.router.navigate([ '/login' ]);
                    return resolve(false);
                }

                this.authService.loadLoggedUser(auth.uid);
                return resolve(true);
            });
        })
    }
}
