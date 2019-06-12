import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Recipe } from '../../models/recipe.model';
import { ApiService } from '../core/api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class RecipesDataService
{
    constructor(private fireDatabase: AngularFireDatabase, private apiService: ApiService) { }

    getRecipes(search?: string) : Observable<any>
    {
        return this.fireDatabase
            .list<Recipe>("recipes", ref => {
                return search ? ref.orderByChild("title").startAt(search).limitToFirst(30) : ref;
            })
            .snapshotChanges();
    }

    getAllRecipes() : Observable<any>
    {
        return this.fireDatabase
            .list<Recipe>("recipes", ref => {
                return ref.orderByChild("title").limitToFirst(30)
            })
            .snapshotChanges();
    }

    getRecipeDetails(key: string) : Observable<any>
    {
        return this.fireDatabase.object(`recipes/${key}`).snapshotChanges();
    }

    searchRecipes(search: string, ingredients: Array<string> = [])
    {
        const params = new HttpParams().set("search", search).set("ingredients", JSON.stringify(ingredients))
        return this.apiService.getData("recipes", params);
    }
}
