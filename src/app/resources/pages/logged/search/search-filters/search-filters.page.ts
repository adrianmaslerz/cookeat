import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Ingredient } from '../../../../../models/ingredient.model';
import { IngredientsDataService } from '../../../../../services/data/ingredients.data.service';

@Component({
    selector: 'app-search-filters',
    templateUrl: './search-filters.page.html',
    styleUrls: [ './search-filters.page.scss' ],
})
export class SearchFiltersPage implements OnInit
{
    search: string = '';
    inProgress: boolean = false;
    results: Array<Ingredient> = [];
    @Input() ingredients: Array<Ingredient> = [];

    constructor(private modalController: ModalController, private ingredientsDataService: IngredientsDataService) { }

    ngOnInit()
    {
    }

    onCancel()
    {
        this.modalController.dismiss({ ingredients: this.ingredients });
    }

    onSearch()
    {
        if(this.search)
            this.getData();
        else
            this.results = [];
    }
    private getData() : void
    {
        this.inProgress = true;
        this.ingredientsDataService.getIngredients(this.search)
            .subscribe(snapshot => {

                this.inProgress = false;
                this.results = snapshot.map(ingredient => { return { ...ingredient.payload.val(), key: ingredient.key } } );
            });
    }

    onAddIngredient(ingredient: Ingredient)
    {
        if(!this.ingredients.map(ingredient => ingredient.key).includes(ingredient.key))
            this.ingredients.push(ingredient);
    }

    onRemoveIngredient(ingredient: Ingredient)
    {
        this.ingredients = this.ingredients.filter(ing => ing.key != ingredient.key);
    }
}
