import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipesDataService } from '../../../../services/data/recipes.data.service';
import { Recipe } from '../../../../models/recipe.model';
import { FavouritesDataService } from '../../../../services/data/favourites.data.service';
import { AuthService } from '../../../../services/core/auth.service';
import { User } from '../../../../models/user.model';
import { flatMap } from 'rxjs/operators';
import { Favourite } from '../../../../models/favourite.model';
import { RecipeIngredient } from '../../../../models/recipe-ingredient.model';
import { Ingredient } from '../../../../models/ingredient.model';
import { IngredientsDataService } from '../../../../services/data/ingredients.data.service';

@Component({
    selector: 'app-recipe-detail',
    templateUrl: './recipe-detail.page.html',
    styleUrls: [ './recipe-detail.page.scss' ],
})
export class RecipeDetailPage implements OnInit
{
    id: string;
    recipe: Recipe;
    allIngredients: Array<Ingredient> = [];
    ingredients: Array<Ingredient> = [];
    favourite: Favourite;

    constructor(
        private route: ActivatedRoute,
        private recipesDataService: RecipesDataService,
        private ingredientsDataService: IngredientsDataService,
        private favouritesDataService: FavouritesDataService,
        private authService: AuthService
    ) { }

    ngOnInit()
    {
        //getting data
        this.id = this.route.snapshot.params["id"];
        this.recipesDataService.getRecipeDetails(this.id)
            .pipe(
                flatMap(snapshot => {
                    this.recipe = { ...snapshot.payload.val(), key: snapshot.key };
                    return this.favouritesDataService.getUserFavourites(this.authService.logged.id);
                }),
                flatMap(snapshotList => {
                    this.favourite = snapshotList.find(snapshot => {
                        const favourite = <Favourite>{ ...snapshot.payload.val(), key: snapshot.key };
                        return favourite.recipe_id == this.id;
                    });
                    return this.ingredientsDataService.getAllIngredients();
                }),
                flatMap(snapshotList => {
                    this.allIngredients = snapshotList.map(snapshot => {
                        const ingredient = <Ingredient>{ ...snapshot.payload.val(), key: snapshot.key };
                        return ingredient;
                    });
                    return this.ingredientsDataService.getRecipeIngredients(this.recipe.id);
                })
            )
            .subscribe((snapshotList: Array<any>) => {

                this.ingredients = snapshotList.map(snapshot => {
                    const recipeIngredient = <RecipeIngredient>{ ...snapshot.payload.val(), key: snapshot.key };
                    return this.allIngredients.find(ingredient => ingredient.id == recipeIngredient.ingredient_id);
                })
            });
    }

    onFavourite()
    {
        if(this.favourite)
            this.favouritesDataService.removeFavourite(this.favourite.key);
        else
            this.favouritesDataService.addFavourite(this.authService.logged.id, this.id);
    }

}
