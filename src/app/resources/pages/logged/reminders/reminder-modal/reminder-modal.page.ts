import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from '../../../../../services/core/auth.service';
import { RemindersDataService } from '../../../../../services/data/reminders.data.service';
import { IngredientsDataService } from '../../../../../services/data/ingredients.data.service';
import { Ingredient } from '../../../../../models/ingredient.model';
import { Reminder } from '../../../../../models/reminder.model';

@Component({
    selector: 'app-reminder-modal',
    templateUrl: './reminder-modal.page.html',
    styleUrls: [ './reminder-modal.page.scss' ],
})
export class ReminderModalPage implements OnInit
{
    @Input() type: string;
    search: string = '';
    inProgress: boolean = false;
    results: Array<Ingredient> = [];
    ingredients: Array<Ingredient> = [];
    date: any;

    constructor(
        private modalController: ModalController,
        private toastController: ToastController,
        private authService: AuthService,
        private remindersDataService: RemindersDataService,
        private ingredientsDataService: IngredientsDataService,

    ) { }

    ngOnInit() {}

    onCancel()
    {
        this.modalController.dismiss();
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

    onSearch()
    {
        this.getData();
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

    onSubmit()
    {
        //adding reminder
        if(this.date)
        {
            const reminder = new Reminder();
            reminder.date = this.date;
            reminder.ingredients = this.ingredients.map(ingredient => ingredient.key);
            reminder.type = this.type;
            reminder.user_id = this.authService.logged.id;

            this.remindersDataService.addReminder(reminder)
                .then(() => {
                    this.modalController.dismiss();
                    return this.toastController.create({
                        message: "Reminder created",
                        duration: 2000
                    })
                })
                .then(toast => toast.present());
        }
    }

}
