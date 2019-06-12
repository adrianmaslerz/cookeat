//core
const FCM = require('fcm-push');

//models
const { Recipe} = require("../../models/Recipe");
const { Ingredient} = require("../../models/Ingredient");

//config
const variables = require("./../../../config/variables");

const notificationSettings = {
    BREAKFAST: {
        title: "New breakfast!",
        description: ["CookEat propose ", " on breakfast"],
        inputs: ["name"]
    },
    DINNER: {
        title: "New dinner!",
        description: ["CookEat propose ", " on dinner"],
        inputs: ["name"]
    },
    SUPPER: {
        title: "New supper!",
        description: ["CookEat propose ", " on supper"],
        inputs: ["name"]
    },
}

module.exports = class
{
    constructor()
    {
        this.fcm =  new FCM(variables.services.firebase.key)
    }

    async addNotification(user, recipe, reminder, firebase)
    {
        //getting type name
        const type = reminder.type.toUpperCase();
        if(Object.keys(notificationSettings).includes(type))
        {
            //saving notification
            const ref = firebase.ref("notifications");
            ref.push({
                reminder_id: reminder.key,
                recipe_id: recipe.key,
                user_id: user.id,
                created: new Date().toDateString()
            });

            //sending push
            if(user.token)
            {
                const inputs = {
                    name: recipe.title
                };
                const description = this.prepareDescription(type, inputs)
                this.sendNotification(user.token, notificationSettings[type].title, description);
            }
        }
    }

    prepareDescription(type, inputs = {})
    {
        const pattern = /^(?![a-z\s]).*/;
        let description = "";

        const descriptionSources = notificationSettings[type].description;
        const inputTypes = notificationSettings[type].inputs;

        for(let i = 0; i < Math.max(descriptionSources.length, inputTypes.length); i++)
            description += pattern.test(descriptionSources[0]) ? (descriptionSources[i] || "") + (inputs[inputTypes[i]] || "") : (inputs[inputTypes[i]] || "") + (descriptionSources[i] || "");

        return description;
    }

    sendNotification(to, title, description)
    {
        const message = {
            to: to,
            data: {
                title: title,
                body: description,
                sound: true
            },
            notification: {
                title: title,
                body: description,
                sound: true
            }
        };

        this.fcm.send(message)
            .then(response => console.log("Successfully sent with response: ", response))
            .catch(err => {
                console.log("Something has gone wrong!");
                console.error(err);
            })
    }
    
    async chooseRecipe(reminder)
    {
        let ingredients = [];
        if(reminder.ingredients && reminder.ingredients.length)
            ingredients = await Ingredient.find({ key: reminder.ingredients }).exec();

        //available options
        const count = await Recipe.count({...(ingredients.length ? { ingredients: { $in: ingredients }} : undefined)}).exec();

        //preparing number
        const index = Math.max(parseInt(this.getRandomArbitrary(1, count)), 1);

        //getting recipe
        const recipe = (await Recipe.find({...(ingredients.length ? { ingredients: { $in: ingredients }} : undefined)}).skip(index - 1).limit(1)).pop();
        if(recipe)
        {
            return recipe;
        }
        else
        {
            delete reminder.ingredients;
            return this.chooseRecipe(reminder)
        }
    }

    getRandomArbitrary(min, max)
    {
        return Math.random() * (max - min) + min;
    }
};
