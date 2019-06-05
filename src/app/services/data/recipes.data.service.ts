import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Recipe } from '../../models/recipe.model';

@Injectable({
    providedIn: 'root'
})
export class RecipesDataService
{
    constructor(private fireDatabase: AngularFireDatabase) { }

    getRecipes(search: string) : Observable<any>
    {
        return this.fireDatabase
            .list<Recipe>("recipes", ref => {
                return ref.orderByChild("title")
                    .startAt(search)
                    .limitToFirst(30);
            })
            .snapshotChanges();
    }

    getRecipeDetails(key: string) : Observable<any>
    {
        return this.fireDatabase.object(`recipes/${key}`).snapshotChanges();
    }
}
