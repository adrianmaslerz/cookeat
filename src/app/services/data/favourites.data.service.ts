import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Favourite } from '../../models/favourite.model';

@Injectable({
    providedIn: 'root'
})
export class FavouritesDataService
{
    constructor(private fireDatabase: AngularFireDatabase) { }

    getUserFavourites(userId: string) : Observable<any>
    {
        return this.fireDatabase
            .list<Favourite>("favourites", ref => {
                return ref.orderByChild("user_id").equalTo(userId);
            })
            .snapshotChanges();
    }

    addFavourite(userId: string, recipeId: string)
    {
        const ref = this.fireDatabase.list("favourites");
        return ref.push({
            user_id: userId,
            recipe_id: recipeId
        });
    }

    removeFavourite(key: string) : Promise<any>
    {
        const ref = this.fireDatabase.object("favourites/" + key);
        return ref.remove();
    }
}
