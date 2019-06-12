import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ReminderModalPage } from './reminder-modal/reminder-modal.page';
import { Reminder } from '../../../../models/reminder.model';
import { AuthService } from '../../../../services/core/auth.service';
import { RemindersDataService } from '../../../../services/data/reminders.data.service';
import { Ingredient } from '../../../../models/ingredient.model';
import { IngredientsDataService } from '../../../../services/data/ingredients.data.service';

@Component({
    selector: 'app-reminders',
    templateUrl: './reminders.page.html',
    styleUrls: [ './reminders.page.scss' ],
})
export class RemindersPage implements OnInit
{
    private ingredients: Array<Ingredient> = [];
    breakfast: Array<Reminder> = [];
    dinner: Array<Reminder> = [];
    supper: Array<Reminder> = [];
    inProgress: boolean = false;

    constructor(
        private modalController: ModalController,
        private authService: AuthService,
        private remindersDataService: RemindersDataService,
        private ingredientsDataService: IngredientsDataService
    ) { }

    ngOnInit()
    {
        //load ingredients snapshot
        this.inProgress = true;
        this.ingredientsDataService.getAllIngredients()
            .subscribe(snapshot => {

                this.inProgress = false;
                this.ingredients = snapshot.map(ingredient => { return { ...ingredient.payload.val(), key: ingredient.key } } );
            });

        if(!this.authService.logged)
            this.authService.user.subscribe(() => this.getData())
        else
            this.getData();
    }

    getData()
    {
        this.inProgress = true;
        this.remindersDataService
            .getUserReminders(this.authService.logged.id)
            .subscribe(snapshot => {

                this.inProgress = false;
                const results = <Array<Reminder>>snapshot.map(reminder => { return { ...reminder.payload.val(), key: reminder.key } } );
                this.breakfast = results.filter(reminder => reminder.type == "breakfast");
                this.dinner = results.filter(reminder => reminder.type == "dinner");
                this.supper = results.filter(reminder => reminder.type == "supper");

            });
    }

    onAddReminderModal(type: string)
    {
        this.modalController.create({
            component: ReminderModalPage,
            componentProps: { type: type }
        })
        .then(modal => {
            modal.present();
        });
    }
    onRemoveReminder(reminder: Reminder)
    {
        this.remindersDataService.removeReminder(reminder.key);
    }

    getIngredient(key: string) : Ingredient
    {
        return this.ingredients.find(ingredient => ingredient.key == key);
    }

    prepareIngredients(keys: Array<string>) : Array<string>
    {
        const ingredients : Array<Ingredient> = [];
        if(keys)
        {
            keys.forEach(key => {
                const ingredient = this.ingredients.find(ingredient => ingredient.key == key);
                if(ingredient)
                    ingredients.push(ingredient);
            })

            return ingredients.map(ingredient => ingredient.title);
        }
        else
            return [];
    }

}
