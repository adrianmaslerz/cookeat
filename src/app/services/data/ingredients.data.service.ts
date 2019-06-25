import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Ingredient } from '../../models/ingredient.model';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../core/api.service';

@Injectable({
    providedIn: 'root'
})
export class IngredientsDataService
{
    constructor(private fireDatabase: AngularFireDatabase, private apiService: ApiService) { }

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

    getRecipeIngredients(recipeId: string) : Observable<any>
    {
        return this.fireDatabase
            .list<Ingredient>("recipes_ingredients",ref => {
                return ref.orderByChild("recipe_id").equalTo(recipeId)
            })
            .snapshotChanges();
    }

    searchIngredients(search: string)
    {
        const params = new HttpParams().set("search", search);
        return this.apiService.getData("ingredients", params);
    }
}
