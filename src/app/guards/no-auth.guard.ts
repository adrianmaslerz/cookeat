import { Injectable } from '@angular/core';
import { Router, CanLoad, Route, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanLoad
{
    constructor(private fireAuth: AngularFireAuth, private router: Router) { }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean
    {
        return new Promise(resolve => {

            this.fireAuth.authState.subscribe(auth => {
                if(auth)
                    this.router.navigate([ '/logged/home' ]);

                return resolve(true);
            });
        })
    }
}
