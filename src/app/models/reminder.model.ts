import { Ingredient } from './ingredient.model';

export class Reminder
{
    id: string;
    user_id: string;
    date: string;
    type: string;
    ingredients: Array<Ingredient>
}
