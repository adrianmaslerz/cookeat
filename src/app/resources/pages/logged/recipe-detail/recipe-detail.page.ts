import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipesDataService } from '../../../../services/data/recipes.data.service';
import { Recipe } from '../../../../models/recipe.model';

@Component({
    selector: 'app-recipe-detail',
    templateUrl: './recipe-detail.page.html',
    styleUrls: [ './recipe-detail.page.scss' ],
})
export class RecipeDetailPage implements OnInit
{
    id: string;
    recipe: Recipe;

    constructor(private route: ActivatedRoute, private recipesDataService: RecipesDataService) { }

    ngOnInit()
    {
        this.id = this.route.snapshot.params["id"];
        this.recipesDataService.getRecipeDetails(this.id)
            .subscribe(snapshot => {
                this.recipe = { ...snapshot.payload.val(), key: snapshot.key };
            })
    }

}
