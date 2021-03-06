import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ApiService
{

    constructor(private http: HttpClient) { }

    getData(url, params) : Observable<any>
    {
        return this.http.get(environment.api + "/api/" + url, { params: params });
    }
}
