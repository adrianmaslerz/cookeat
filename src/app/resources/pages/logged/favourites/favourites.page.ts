import { Component, OnInit } from '@angular/core';
import { RecipesDataService } from '../../../../services/data/recipes.data.service';
import { FavouritesDataService } from '../../../../services/data/favourites.data.service';
import { AuthService } from '../../../../services/core/auth.service';
import { Favourite } from '../../../../models/favourite.model';
import { flatMap } from 'rxjs/operators';
import { Recipe } from '../../../../models/recipe.model';

@Component({
    selector: 'app-favourites',
    templateUrl: './favourites.page.html',
    styleUrls: [ './favourites.page.scss' ],
})
export class FavouritesPage implements OnInit
{
    inProgress: boolean = false;
    private favourites: Array<Favourite> = [];
    results: Array<Recipe> = []

    constructor(
        private recipesDataService: RecipesDataService,
        private favouritesDataService: FavouritesDataService,
        private authService: AuthService
    ) { }

    ngOnInit()
    {
        this.inProgress = true;
        if(!this.authService.logged)
            this.authService.user.subscribe(() => this.getData())
        else
            this.getData();
    }

    getData()
    {
        this.favouritesDataService
            .getUserFavourites(this.authService.logged.id)
            .pipe(flatMap((snapshotList: Array<any>) => {
                this.favourites = snapshotList.map(snapshot => <Favourite>{ ...snapshot.payload.val(), key: snapshot.key });
                return this.recipesDataService.getRecipes();
            }))
            .subscribe(snapshotList => {

                this.inProgress = false;
                this.results = snapshotList.map(snapshot => <Recipe>{ ...snapshot.payload.val(), key: snapshot.key } )
                    .filter((recipe: Recipe) => this.favourites.map(favourite => favourite.recipe_id).includes(recipe.key));
            });
    }
}
