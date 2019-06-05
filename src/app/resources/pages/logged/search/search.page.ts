import { Component, OnInit } from '@angular/core';
import { RecipesDataService } from '../../../../services/data/recipes.data.service';
import { Recipe } from '../../../../models/recipe.model';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: [ './search.page.scss' ],
})
export class SearchPage implements OnInit
{
    results: Array<Recipe> = [];
    search: string = "";
    inProgress: boolean = false;

    constructor(private recipesDataService: RecipesDataService) { }

    ngOnInit() {}

    private getData() : void
    {
        this.inProgress = true;
        this.recipesDataService.getRecipes(this.search)
            .subscribe(snapshot => {

            this.inProgress = false;
            this.results = snapshot.map(recipe => recipe.payload.val());
        });
    }

    onSearch() : void
    {
        this.getData();
    }
}
