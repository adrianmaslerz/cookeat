import { Component, OnInit } from '@angular/core';
import { RecipesDataService } from '../../../../services/data/recipes.data.service';
import { Recipe } from '../../../../models/recipe.model';
import { ReminderModalPage } from '../reminders/reminder-modal/reminder-modal.page';
import { ModalController } from '@ionic/angular';
import { SearchFiltersPage } from './search-filters/search-filters.page';
import { Ingredient } from '../../../../models/ingredient.model';

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
    ingredients: Array<Ingredient> = [];

    constructor(private recipesDataService: RecipesDataService, private modalController: ModalController) { }

    ngOnInit() {}

    private getData() : void
    {
        this.inProgress = true;
        this.recipesDataService.getRecipes(this.search)
            .subscribe(snapshot => {

            this.inProgress = false;
            this.results = snapshot.map(recipe => { return { ...recipe.payload.val(), key: recipe.key } } );
        });
    }

    onSearch() : void
    {
        this.getData();
    }

    onFilter()
    {
        this.modalController.create({
            component: SearchFiltersPage,
            componentProps: { ingredients: this.ingredients }
        })
        .then(modal => {
            modal.present();
            return modal.onDidDismiss()
        })
        .then(result => {
            this.ingredients = result.data.ingredients;
            this.getData();
        });
    }
}
