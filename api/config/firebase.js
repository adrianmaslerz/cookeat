const admin = require("firebase-admin");

const variables = require("./variables");
const serviceAccount = require(variables.services.firebase.service_account);

const { Recipe } = require("./../app/models/Recipe");
const { Ingredient } = require("./../app/models/Ingredient");

module.exports.load = function(app)
{
    const firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: variables.services.firebase.db_url
    });

    app.firebase = { db: firebaseApp.database() };
};

module.exports.index = async function(app)
{
    //cleaning database
    await Recipe.remove();
    await Ingredient.remove();

    //ingredients
    const ingredientsRef = app.firebase.db.ref("ingredients");
    const ingredientsSnapshot = await ingredientsRef.once("value")
    const ingredients = [];
    ingredientsSnapshot.forEach(data => {
        const object = {...data.val(), key: data.key };
        if(object.title && object.key && object.id )
        {
            const ingredient = new Ingredient(object)
            ingredients.push(ingredient);
        }
    });
    await Ingredient.insertMany(ingredients);


    //loading recipes ingredients references
    let recipesIngredients = [];
    const recipesIngredientsRef = app.firebase.db.ref("recipes_ingredients");
    const recipesIngredientsSnapshot = await recipesIngredientsRef.once("value");

    //parsing recipes ingredients
    recipesIngredientsSnapshot.forEach(data => {
        const object = {...data.val(), key: data.key };
        recipesIngredients.push(object);
    });



    //recipes
    const recipesRef = app.firebase.db.ref("recipes");
    const recipesSnapshot = await recipesRef.once("value");

    //parsing recipes
    const recipes = [];
    recipesSnapshot.forEach(data => {
        const object = {...data.val(), key: data.key };
        const recipe = new Recipe(object);
        recipes.push(recipe);
    });


    await Promise.all(recipes.map(async recipe => {
        const ingredientsIds = recipesIngredients.filter(recipesIngredient => recipesIngredient.recipe_id == recipe.id).map(recipesIngredient => recipesIngredient.id);
        recipe.ingredients = await Ingredient.find({ id: { $in: ingredientsIds }}).exec();
        return recipe;
    }));

    await Recipe.insertMany(recipes);
}
