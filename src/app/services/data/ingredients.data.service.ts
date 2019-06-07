import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Ingredient } from '../../models/ingredient.model';

@Injectable({
    providedIn: 'root'
})
export class IngredientsDataService
{
    constructor(private fireDatabase: AngularFireDatabase) { }

    getIngredients(search?: string) : Observable<any>
    {
        return this.fireDatabase
            .list<Ingredient>("ingredients", ref => {
                return search ? ref.orderByChild("title").startAt(search).limitToFirst(30) : ref;
            })
            .snapshotChanges();
    }

    getAllIngredients() : Observable<any>
    {
        return this.fireDatabase
            .list<Ingredient>("ingredients",)
            .snapshotChanges();
    }
}
