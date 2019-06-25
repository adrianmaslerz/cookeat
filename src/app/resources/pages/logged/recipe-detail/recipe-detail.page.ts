import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipesDataService } from '../../../../services/data/recipes.data.service';
import { Recipe } from '../../../../models/recipe.model';

import { flatMap } from 'rxjs/operators';

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
    inProgress: boolean = false;
    allIngredients: Array<Ingredient> = [];
    ingredients: Array<Ingredient> = [];

    constructor(
        private route: ActivatedRoute,
        private recipesDataService: RecipesDataService,
        private ingredientsDataService: IngredientsDataService
    ) { }

    ngOnInit()
    {
        //getting data
        this.id = this.route.snapshot.params["id"];
        this.inProgress = true;
        this.recipesDataService.getRecipeDetails(this.id)
            .pipe(
                flatMap(snapshot => {
                    this.recipe = { ...snapshot.payload.val(), key: snapshot.key };
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

                this.inProgress = false;
            });
    }
}
